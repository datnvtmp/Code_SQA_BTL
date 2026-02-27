package com.example.cooking.controller;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.service.ChatBotService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class ChatBotController {
    private final ChatBotService chatBotService;
    // @GetMapping("/response")
    // public ResponseEntity<ApiResponse<String>> getChatBotResponse(@RequestParam String message){
    //     String response = chatBotService.getChatBotResponse(message);
    //     return ApiResponse.ok(response);
    // }
    
}
