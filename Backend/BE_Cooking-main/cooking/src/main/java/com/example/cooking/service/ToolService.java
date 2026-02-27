package com.example.cooking.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.example.cooking.common.enums.AIToolName;
import com.example.cooking.dto.AIToolDTO;

import java.util.ArrayList;
import java.util.List;

@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
@Service
public class ToolService {

    public List<AIToolDTO> getAllTools() {
        List<AIToolDTO> list = new ArrayList<>();
        for (AIToolName tool : AIToolName.values()) {
            list.add(new AIToolDTO(tool.getId(), tool.name()));
        }
        return list;
    }
}