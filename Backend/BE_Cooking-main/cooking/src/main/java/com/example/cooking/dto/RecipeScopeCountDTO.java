package com.example.cooking.dto;

import com.example.cooking.common.enums.Scope;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeScopeCountDTO {
    private Scope scope;
    private Long count;
}
