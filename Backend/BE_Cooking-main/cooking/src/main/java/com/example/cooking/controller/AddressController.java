package com.example.cooking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.dto.request.AddressRequestDto;
import com.example.cooking.dto.response.AddressResponseDto;
import com.example.cooking.security.MyUserDetails;
import com.example.cooking.service.AddressService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/users/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponseDto>> create(
            @AuthenticationPrincipal MyUserDetails myUserDetails,
            @RequestBody AddressRequestDto dto) {
        return ApiResponse.ok(addressService.create(myUserDetails.getId(), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponseDto>> update(
            @AuthenticationPrincipal MyUserDetails myUserDetails,
            @PathVariable Long id,
            @RequestBody AddressRequestDto dto) {
        return ApiResponse.ok(addressService.update(id, myUserDetails.getId(), dto));
    }

    @DeleteMapping("/{id}")
    public void delete(
             @AuthenticationPrincipal MyUserDetails myUserDetails,
            @PathVariable Long id) {
        addressService.delete(id, myUserDetails.getId());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponseDto>>> list( @AuthenticationPrincipal MyUserDetails myUserDetails) {
        return ApiResponse.ok(addressService.getByUser(myUserDetails.getId()));
    }
}
