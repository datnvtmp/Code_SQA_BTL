package com.example.cooking.controller.pub;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping
@Slf4j
public class Home {
    @GetMapping("/home")
    public ResponseEntity<ApiResponse<String>> home(){
        return ApiResponse.ok("Hello, it works!");
    }
    @GetMapping("/ipn")
    public String handleIPN(@RequestParam Map<String, String> params) {
        log.info("Received IPN request with parameters:");
        params.forEach((key, value) -> log.info("{} = {}", key, value));

        // Tạm thời chỉ log, có thể xử lý logic sau
        return "OK";
    }
}
