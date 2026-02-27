package com.example.cooking.dto.aidto;

import java.util.ArrayList;
import java.util.List;

import org.openapitools.db_data.client.model.SearchRecordsResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponeWithMetadata {
    private String response;
    private List<Integer> toolsUsing = new ArrayList<>();
    private String ingredientInImage;
    private VectorSearchDTO vectorSearchDTO;
}
