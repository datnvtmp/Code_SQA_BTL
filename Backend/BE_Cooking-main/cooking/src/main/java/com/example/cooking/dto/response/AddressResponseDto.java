package com.example.cooking.dto.response;

import lombok.Data;

@Data
public class AddressResponseDto {
    private Long id;
    private String label;
    private Double lat;
    private Double lng;
    private String addressText;
}
