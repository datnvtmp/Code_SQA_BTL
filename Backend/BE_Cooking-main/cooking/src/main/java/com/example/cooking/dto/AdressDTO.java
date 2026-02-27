package com.example.cooking.dto;

import lombok.Data;

@Data
public class AdressDTO {
    private Long id;
    private String label;
    private Double lat;
    private Double lng;
    private String addressText;
}
