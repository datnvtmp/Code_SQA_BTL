package com.example.cooking.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.RequestStatus;
import com.example.cooking.dto.mapper.ChefRequestMapper;
import com.example.cooking.dto.response.ChefRequestResponseDTO;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.ChefRequest;
import com.example.cooking.model.RoleEntity;
import com.example.cooking.model.User;
import com.example.cooking.repository.ChefRequestRepository;
import com.example.cooking.repository.RoleRepository;
import com.example.cooking.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChefRequestService {

    private final ChefRequestRepository chefRequestRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ChefRequestMapper chefRequestMapper;

    public ChefRequest requestToBecomeChef(Long userId) {

        if (chefRequestRepository.existsByUserIdAndStatus(userId, RequestStatus.PENDING)) {
            throw new CustomException("Bạn đã gửi yêu cầu trước đó rồi.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        ChefRequest request = ChefRequest.builder()
                .user(user)
                .status(RequestStatus.PENDING)
                .build();

        return chefRequestRepository.save(request);
    }

    public ChefRequest approveRequest(Long requestId) {
        ChefRequest request = chefRequestRepository.findById(requestId)
                .orElseThrow(() -> new CustomException("Không tìm thấy yêu cầu"));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new CustomException("Yêu cầu đã được xử lý trước đó.");
        }
        request.setStatus(RequestStatus.APPROVED);

        User user = request.getUser();

        // Lấy role "CHEF"
        RoleEntity chefRole = roleRepository.findByName("CHEF")
                .orElseThrow(() -> new CustomException("Role CHEF không tồn tại"));

        // Nếu đã là CHEF rồi thì không thêm nữa
        if (user.getRoles().stream().anyMatch(r -> r.getName().equals("CHEF"))) {
            throw new CustomException("User đã là CHEF");
        }

        // Thêm role vào user
        user.getRoles().add(chefRole);
        userRepository.save(user);

        return chefRequestRepository.save(request);
    }

    public ChefRequest rejectRequest(Long requestId, String note) {
        ChefRequest request = chefRequestRepository.findById(requestId)
                .orElseThrow(() -> new CustomException("Không tìm thấy yêu cầu"));
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new CustomException("Yêu cầu đã được xử lý trước đó.");
        }
        request.setStatus(RequestStatus.REJECTED);
        request.setAdminNote(note);

        return chefRequestRepository.save(request);
    }

    /**
     * Lấy danh sách request có phân trang
     */
    public PageDTO<ChefRequestResponseDTO> getAllRequests(Pageable pageable) {
        Page<ChefRequest> chefResquestPage =  chefRequestRepository.findAll(pageable);
        List<ChefRequestResponseDTO> dtoList = chefRequestMapper.toDtoList(chefResquestPage.getContent());
        return new PageDTO<>(chefResquestPage, dtoList);
    }
}
