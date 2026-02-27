package com.example.cooking.dto.response;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

import com.example.cooking.common.enums.Difficulty;
import com.example.cooking.common.enums.Scope;
import com.example.cooking.common.enums.Status;
import com.example.cooking.dto.CategoryDTO;
import com.example.cooking.dto.TagDTO;
import com.example.cooking.dto.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecipeSummaryDTO {

    private Long id;

    private String title;

    private String description;

    private String imageUrl;

    private Long prepTime;

    private Long cookTime;

    private Difficulty difficulty;

    private Long servings;

    private Scope scope;

    private Status status;

    private Long views = 1L;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    private Set<CategoryDTO> categories = new LinkedHashSet<>();
    private Set<TagDTO> tags = new LinkedHashSet<>();

    private UserDTO user;

    private Long likeCount;

    private Long commentCount;

    private Boolean likedByCurrentUser;

    private Long saveCount;

    private Boolean savedByCurrentUser;

    
    public static RecipeSummaryDTO unavailablePlaceholder(Long recipeId) {
        RecipeSummaryDTO dto = new RecipeSummaryDTO();
        dto.setId(recipeId);
        dto.setTitle("Công thức này hiện không khả dụng");
        dto.setDescription("Công thức đã được đặt ở chế độ riêng tư hoặc đã bị gỡ bỏ.");
        dto.setImageUrl(null);
        dto.setScope(com.example.cooking.common.enums.Scope.PRIVATE);
        dto.setStatus(com.example.cooking.common.enums.Status.REJECTED); // hoặc tạo enum riêng nếu cần
        return dto;
    }

}
