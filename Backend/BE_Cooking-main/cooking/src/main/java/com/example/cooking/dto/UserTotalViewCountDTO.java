package com.example.cooking.dto;

import lombok.Data;

@Data
public class UserTotalViewCountDTO {
    private UserDTO user;
    private Long totalViews;
}
