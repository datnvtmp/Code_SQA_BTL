package com.example.cooking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecipeIngredientRequestDTO {
    private Float quantity;      // Số lượng (nếu có)
    private String unit;         // Đơn vị, ví dụ "gram", "quả", "muỗng"
    @NotNull
    private String rawName;     // Tên nguyên liệu gốc do user nhập
    private String note;       // Ghi chú thêm về nguyên liệu (nếu có)
    private Integer displayOrder; // Thứ tự hiển thị trong danh sách
}
