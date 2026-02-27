package com.example.cooking.service;

import com.example.cooking.model.Collection;
import com.example.cooking.model.CollectionRecipe;
import com.example.cooking.model.Recipe;
import com.example.cooking.model.User;
import com.example.cooking.repository.CollectionRecipeRepository;
import com.example.cooking.repository.CollectionRepository;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.cooking.exception.ResourceNotFoundException;
import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.CollectionDTO;
import com.example.cooking.dto.mapper.CollectionMapper;
import com.example.cooking.dto.mapper.RecipeMapper;
import com.example.cooking.dto.projection.CollectionRecipeCount;
import com.example.cooking.dto.request.CollectionRequest;
import com.example.cooking.dto.response.RecipeSummaryDTO;
import com.example.cooking.exception.CustomException;
import com.example.cooking.security.MyUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CollectionService {
    private final CollectionRepository collectionRepository;
    private final UserRepository userRepository;
    private final CollectionMapper collectionMapper;
    private final RecipeRepository recipeRepository;
    private final CollectionRecipeRepository collectionRecipeRepository;
    private final AccessService accessService;
    private final RecipeMapper recipeMapper;
    private final RecipeEnrichmentService recipeEnrichmentService;

    public CollectionDTO createCollection(MyUserDetails currentUser, CollectionRequest request) {
        Collection collection = new Collection();
        collection.setName(request.getName());
        collection.setDescription(request.getDescription());
        collection.setPublic(request.isPublic());
        User user = userRepository.getReferenceById(currentUser.getId());
        collection.setUser(user);
        if (collectionRepository.existsByNameAndUserId(request.getName(), user.getId())) {
            throw new CustomException("Tên bộ sưu tập đã tồn tại");
        }
        collection = collectionRepository.save(collection);
        CollectionDTO dto = collectionMapper.toCollectionDTO(collection);
        dto.setRecipeCount(0L);
        return dto;
    }

    @Transactional
    public CollectionDTO updateCollection(MyUserDetails currentUser, Long collectionId,
            CollectionRequest request) {
        User user = userRepository.getReferenceById(currentUser.getId());
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new CustomException("Không tìm thấy bộ sưu tập"));
        // Kiểm tra quyền sở hữu
        if (!collection.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("You don't have permission to update this collection");
        }
        // KIểm tra trùng tên
        if (!collection.getName().equals(request.getName()) && // chỉ kiểm tra nếu tên thay đổi
            collectionRepository.existsByNameAndUserId(request.getName(), user.getId())) {
            throw new CustomException("Tên bộ sưu tập đã tồn tại");
        }
        collection.setName(request.getName());
        collection.setDescription(request.getDescription());
        collection.setPublic(request.isPublic());
        // collection = collectionRepository.save(collection); // Không cần gọi save vì
        // trong transaction, entity đã được quản lý
        CollectionDTO dto = collectionMapper.toCollectionDTO(collection);
        List<CollectionDTO> dtos = new ArrayList<>();
        dtos.add(dto);
        dtos = enrichCollectionDTOs(dtos);
        return dtos.get(0);
    }

    public void deleteCollection(MyUserDetails currentUser, Long collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new CustomException("Collection not found"));
        // Kiểm tra quyền sở hữu
        if (!collection.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Bạn không có quyền xóa bộ sưu tập này");
        }

        collectionRepository.delete(collection);
    }

    @Transactional
    public void addRecipeToCollection(MyUserDetails currentUser, Long collectionId, Long recipeId) {
        User user = userRepository.getReferenceById(currentUser.getId());
        // Lấy collection
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new CustomException("Không tìm thấy bộ sưu tập có id = " + collectionId));

        // Kiểm tra quyền sở hữu collection
        if (!collection.getUser().getId().equals(user.getId())) {
            throw new CustomException("Bạn không có quyền thêm công thức vào bộ sưu tập này.");
        }
        // Lấy recipe
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công thức"));
        accessService.checkRecipeAccess(recipe, user.getId());
        // Target: Nếu công thức là PUBLIC + APPROCVE -> cho thêm vào tất cả
        // nếu không thì chỉ cho thêm vào Private collection

        if (collection.isPublic()) {
            if (recipe.getScope() != com.example.cooking.common.enums.Scope.PUBLIC) {
                throw new CustomException("Bạn không thể thêm công thức không công khai vào bộ sưu tập công khai");
            }
            if (recipe.getStatus() != com.example.cooking.common.enums.Status.APPROVED) {
                throw new CustomException("Bạn không thể thêm công thức chưa kiểm duyệt vào bộ sưu tập công khai");
            }
        }

        // Kiểm tra xem công thức đã tồn tại trong bộ sưu tập chưa
        boolean exists = collectionRecipeRepository.existsByCollectionIdAndRecipeId(collectionId, recipeId);
        if (exists) {
            throw new CustomException("Công thức này đã có trong bộ sưu tập.");
        }
        // Tạo đối tượng liên kết
        CollectionRecipe collectionRecipe = new CollectionRecipe();
        collectionRecipe.setCollection(collection);
        collectionRecipe.setRecipe(recipeRepository.getReferenceById(recipeId));

        // Lưu vào database
        collectionRecipeRepository.save(collectionRecipe);

    }

    @Transactional
    public void removeRecipeFromCollection(MyUserDetails currentUser, Long collectionId, Long recipeId) {
        // Lấy user hiện tại
        User user = userRepository.getReferenceById(currentUser.getId());

        // Lấy collection
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new CustomException("Không tìm thấy bộ sưu tập có id = " + collectionId));

        // Kiểm tra quyền sở hữu collection
        if (!collection.getUser().getId().equals(user.getId())) {
            throw new CustomException("Bạn không có quyền xóa công thức khỏi bộ sưu tập này.");
        }

        // Tìm bản ghi CollectionRecipe
        CollectionRecipe collectionRecipe = collectionRecipeRepository
                .findByCollectionIdAndRecipeId(collectionId, recipeId)
                .orElseThrow(() -> new CustomException("Công thức này không tồn tại trong bộ sưu tập."));

        // Xóa bản ghi khỏi DB
        collectionRecipeRepository.delete(collectionRecipe);
    }

    public PageDTO<CollectionDTO> getCollectionsByUserId(MyUserDetails currentUser, Long targetUserId,
            Pageable pageable) {
        // 1. Kiểm tra user hiện tại và user cần lấy có phải cùng 1 người
        boolean isOwner = currentUser.getId().equals(targetUserId);
        // 2. Nếu cùng 1 người thì find all, else findpublic
        Page<Collection> page;
        if (isOwner) {
            // Chính chủ: lấy tất cả
            page = collectionRepository.findByUserId(targetUserId, pageable);
        } else {
            // Người lạ: chỉ lấy public
            page = collectionRepository.findByUserIdAndIsPublicTrue(targetUserId, pageable);
        }
        if (page.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        // 3. Enrich all
        // map sang DTO
        List<CollectionDTO> dtos = collectionMapper.toListCollectionDTO(page.getContent());
        // enrich & to DTO
        dtos = enrichCollectionDTOs(dtos);
        // return
        return new PageDTO<>(page, dtos);
    }

    public CollectionDTO getCollectionsById(MyUserDetails currentUser, Long collectionId) {
        
        Collection collection = collectionRepository.findById(collectionId).orElseThrow(()-> new CustomException("Khong tim thay colelction voi id nay"));
        boolean viewAble = true;
        if (!collection.isPublic()){
            viewAble = currentUser.getId().equals(collection.getUser().getId());
        }
        if (!viewAble){
            throw new CustomException("Ban khong co quyen xem collection nay");
        }

        List<Collection> tempListCollections = new ArrayList<>();
        tempListCollections.add(collection);
        // 3. Enrich all
        // map sang DTO
        List<CollectionDTO> dtos = collectionMapper.toListCollectionDTO(tempListCollections);
        // enrich & to DTO
        dtos = enrichCollectionDTOs(dtos);
        // return
        return dtos.get(0);
    }

    public PageDTO<RecipeSummaryDTO> getRecipesByCollectionId(MyUserDetails currentUser, Pageable pageable,
            Long collectionId) {
        // Lấy collection
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new CustomException("Không tìm thấy bộ sưu tập có id = " + collectionId));
        // Kiểm tra quyền xem collection
        if (!collection.isPublic() && !collection.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Bạn không có quyền xem công thức trong bộ sưu tập này");
        }
        
        Page<Recipe> pages = recipeRepository.findRecipesByCollectionId(collectionId, pageable);
        List<RecipeSummaryDTO> dtos = recipeMapper.toSummaryDTOList(pages.getContent());
        dtos = recipeEnrichmentService.enrichAllForRecipeSummaryDTOs(dtos, currentUser.getId());
        // Áp dụng filter logic cho từng recipe. Nếu không khả dụng (bị đổi trạng thái -> trả về recipe đặc biệt)
        dtos = dtos.stream().map(dto -> {
            boolean isUnavailable = dto.getScope() != com.example.cooking.common.enums.Scope.PUBLIC ||
                    dto.getStatus() != com.example.cooking.common.enums.Status.APPROVED;

            if (isUnavailable) {
                return RecipeSummaryDTO.unavailablePlaceholder(dto.getId());
            }
            return dto;
        })
                .collect(Collectors.toList());
        return new PageDTO<>(pages, dtos);
    }

    ///////////////////////////////////
    public List<CollectionDTO> enrichCollectionDTOs(List<CollectionDTO> dtos) {
        if (dtos.isEmpty())
            return java.util.Collections.emptyList();
        List<Long> collectionIds = dtos.stream().map(CollectionDTO::getId).collect(Collectors.toList());
        // fecth
        List<CollectionRecipeCount> collectionRecipeCounts = collectionRecipeRepository
                .countRecipesByCollectionIds(collectionIds);
        Map<Long, Long> collectionRecipeCountsMap = collectionRecipeCounts.stream()
                .collect(Collectors.toMap(
                        CollectionRecipeCount::getCollectionId, CollectionRecipeCount::getRecipeCount));
        // inject
        dtos.stream().forEach(dto -> {
            Long collectionId = dto.getId();
            dto.setRecipeCount(collectionRecipeCountsMap.getOrDefault(collectionId, 0L));
        });
        return dtos;
    }

}
