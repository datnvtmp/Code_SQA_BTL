package com.example.cooking.dto.request;
import lombok.Data;

@Data
public class CollectionRequest {
    private String name;
    private String description;
    private boolean isPublic = false;

}
