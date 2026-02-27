package com.example.cooking.service;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.multipart.MultipartFile;



@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public interface ChatBotService {
    String getChatBotResponse(String userMessage);

    String getChatBotResponseWithTool(String userMessage, List<Integer> toolNumbers, MultipartFile image);

    String getChatBotResponseWithImage(String userMessage, MultipartFile image);
}