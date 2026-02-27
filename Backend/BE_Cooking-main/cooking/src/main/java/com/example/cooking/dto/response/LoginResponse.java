package com.example.cooking.dto.response;

import com.example.cooking.dto.UserDTO;
import com.example.cooking.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private UserDTO user;
}
