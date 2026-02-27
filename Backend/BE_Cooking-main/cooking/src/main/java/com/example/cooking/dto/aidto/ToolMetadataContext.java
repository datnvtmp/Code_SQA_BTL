package com.example.cooking.dto.aidto;

import java.util.ArrayList;
import java.util.List;

import org.openapitools.db_data.client.model.SearchRecordsResponse;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import lombok.Data;

@Component
// @RequestScope // Quan trọng: Mỗi request sẽ có một instance riêng
@RequestScope(proxyMode = ScopedProxyMode.TARGET_CLASS) // Quan trọng: Mỗi request sẽ có một instance riêng
@Data
public class ToolMetadataContext {
    private List<Integer> toolsUsing = new ArrayList<>();
    private String ingredientInImage;
    private VectorSearchDTO vectorSearchDTO;
}