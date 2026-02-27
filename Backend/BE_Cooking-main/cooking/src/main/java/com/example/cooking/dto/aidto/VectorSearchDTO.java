package com.example.cooking.dto.aidto;


import org.openapitools.db_data.client.model.SearchRecordsResponseResult;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VectorSearchDTO {
    private String keyWord;
    private SearchRecordsResponseResult result;
}