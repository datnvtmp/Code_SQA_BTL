package com.example.cooking.dto.request;

import lombok.Data;

@Data
public class AddressRequestDto {
    private String label;
    private Double lat;
    private Double lng;
    private String addressText;
}
