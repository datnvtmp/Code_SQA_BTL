package com.example.cooking.dto.response;

import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.CollectionDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CollectionDetailWithRecipeDTO {
    private CollectionDTO collectionDTO;
    private PageDTO<RecipeSummaryDTO> pageRecipeSummaryDTO;
}
