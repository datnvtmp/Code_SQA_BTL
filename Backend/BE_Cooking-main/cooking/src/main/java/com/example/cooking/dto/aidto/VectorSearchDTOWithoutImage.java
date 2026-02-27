package com.example.cooking.dto.aidto;


import java.util.List;

import org.openapitools.db_data.client.model.Hit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VectorSearchDTOWithoutImage {
    private String keyWord;
    private List<Hit> resultHit;
}