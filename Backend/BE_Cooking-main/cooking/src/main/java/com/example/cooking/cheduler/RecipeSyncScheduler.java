package com.example.cooking.cheduler;

import com.example.cooking.dto.payloads.PayloadRecipeJson;
import com.example.cooking.model.*;
import com.example.cooking.repository.OutBoxEventRepository;
import com.example.cooking.repository.RecipeRepository;
import com.example.cooking.repository.RecipeSearchIndexRepository;
import com.example.cooking.service.PineconeDataService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class RecipeSyncScheduler {

    private final OutBoxEventRepository outBoxEventRepository;
    private final RecipeRepository recipeRepo;
    private final RecipeSearchIndexRepository searchRepo;
    private final PineconeDataService pineconeDataService;
    private final ObjectMapper objectMapper;

    @Scheduled(fixedDelay = 30_000)
    @Transactional
    public void processOutboxEvents() {
        List<OutBoxEvent> events = outBoxEventRepository.findTop100ByProcessedFalseOrderByCreatedAtAsc();
        if (events.isEmpty()) return;

        log.info("Processing {} outbox events...", events.size());

        for (OutBoxEvent event : events) {
            try {
                if ("RECIPE_CREATED".equals(event.getEventType()) || "RECIPE_UPDATE".equals(event.getEventType())) {
                    
                    // 1. Xử lý Logic Search Index (Thay thế cho Listener cũ)
                    updateLocalSearchIndex(event.getAggregateId());

                    // 2. Xử lý Logic Pinecone Sync
                    syncToPinecone(event);
                }
                
                event.setProcessed(true);
                outBoxEventRepository.save(event);
            } catch (Exception ex) {
                log.error("Failed to process event ID {}: {}", event.getId(), ex.getMessage());
            }
        }
    }

    /**
     * LOGIC 1: Cập nhật Database Search Index nội bộ (Chuyển từ Listener sang)
     */
    private void updateLocalSearchIndex(Long recipeId) {
        Recipe recipe = recipeRepo.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found for index: " + recipeId));

        StringBuilder sb = new StringBuilder();
        sb.append(recipe.getTitle()).append(" ");
        sb.append(recipe.getDescription()).append(" ");
        recipe.getTags().forEach(t -> sb.append(t.getName()).append(" "));
        recipe.getCategories().forEach(t -> sb.append(t.getName()).append(" "));
        recipe.getRecipeIngredients().forEach(t -> {
            sb.append(t.getIngredient().getName()).append(" ").append(t.getNote()).append(" ");
        });

        RecipeSearchIndex index = searchRepo.findById(recipe.getId())
                .orElse(new RecipeSearchIndex());
        
        index.setRecipe(recipe);
        index.setSearchText(sb.toString().trim());
        searchRepo.save(index);
        log.debug("Local search index updated for recipe: {}", recipeId);
    }

    /**
     * LOGIC 2: Đồng bộ lên Pinecone Vector Database
     */
    private void syncToPinecone(OutBoxEvent event) throws Exception {
        PayloadRecipeJson payloadJson = objectMapper.readValue(event.getPayload(), PayloadRecipeJson.class);

        String textForEmbedding = String.format("Món %s có nguyên liệu là %s và các bước nấu là %s. Mô tả: %s",
                payloadJson.getTitle(),
                payloadJson.getIngredients(),
                payloadJson.getSteps(),
                payloadJson.getDescription());

        Map<String, String> metadata = new HashMap<>();
        metadata.put("_id", Long.toString(event.getAggregateId()));
        metadata.put("title", payloadJson.getTitle());
        metadata.put("text", textForEmbedding);
        metadata.put("imageUrl", payloadJson.getImageUrl());

        List<Map<String, String>> dataToUpsert = new ArrayList<>();
        dataToUpsert.add(metadata);
        
        pineconeDataService.upsertMapData(dataToUpsert);
        log.debug("Pinecone sync completed for recipe: {}", event.getAggregateId());
    }
}