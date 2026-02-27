package com.example.cooking.controller.pub;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.dto.request.AuthRequest;
import com.example.cooking.dto.request.LogoutRequest;
import com.example.cooking.dto.request.RefreshTokenRequest;
import com.example.cooking.dto.request.RegisterRequest;
import com.example.cooking.dto.request.ResetPassRequest;
import com.example.cooking.dto.response.AccessToken;
import com.example.cooking.dto.response.LoginResponse;
import com.example.cooking.exception.CustomException;
import com.example.cooking.security.JwtService;
import com.example.cooking.service.AuthService;
import com.example.cooking.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping(value = "/register/user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> addNewUser(@Valid @ModelAttribute RegisterRequest registerRequest) {
        Long uid = userService.addUser(registerRequest);
        return ApiResponse.ok("User added successfully with ID: " + uid);
    }

    @PostMapping(value = "/register/chef", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> addNewChef(@Valid @ModelAttribute RegisterRequest registerRequest) {
        Long uid = userService.addChef(registerRequest);
        return ApiResponse.ok("Chef added successfully with ID: " + uid);
    }


    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> welcome() {
        return ApiResponse.ok("Auth health");
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        if (!authentication.isAuthenticated()) {
            throw new CustomException("Authentication failed");
        }
        return ApiResponse.ok(authService.handleLoginSuccess(authRequest.getEmail()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AccessToken>> refresh(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return ApiResponse.ok(authService.handleRefresh(refreshTokenRequest.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestBody LogoutRequest logoutRequest) {
        authService.handleLogout(logoutRequest.getRefreshToken());
        return ApiResponse.ok("Logout successful");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPass(@RequestParam(required = true) String email) {
        authService.handleForgotPassword(email);
        return ApiResponse.ok("Chúng tôi đã gửi email đến: "+ email);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @Valid @RequestBody ResetPassRequest request) {

        userService.updatePassword(token,request);
        return ApiResponse.ok("Đổi mật khẩu thành công!");
    }
}
