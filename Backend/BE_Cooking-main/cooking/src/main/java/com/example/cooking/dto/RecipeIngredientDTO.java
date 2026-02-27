package com.example.cooking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecipeIngredientDTO {
    private Float quantity;      // Số lượng (nếu có)
    private String unit;         // Đơn vị, ví dụ "gram", "quả", "muỗng"
    @NotNull
    private String rawName;     // Chuỗi gốc người dùng nhập ("2 quả trứng gà ta")
    private String note;
    private Integer displayOrder; // Thứ tự hiển thị trong danh sách
}
