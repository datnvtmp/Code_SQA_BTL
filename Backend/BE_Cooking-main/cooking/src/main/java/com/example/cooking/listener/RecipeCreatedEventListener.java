package com.example.cooking.listener;

import java.util.stream.Collectors;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.example.cooking.dto.payloads.PayloadRecipeJson;
import com.example.cooking.dto.request.NewRecipeRequest;
import com.example.cooking.dto.request.RecipeIngredientRequestDTO;
import com.example.cooking.event.RecipeCreatedEvent;
import com.example.cooking.model.OutBoxEvent;
import com.example.cooking.repository.OutBoxEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class RecipeCreatedEventListener {

    private final OutBoxEventRepository outboxRepository;
    private final ObjectMapper objectMapper;

    @EventListener
    public void handleRecipeCreatedEvent(RecipeCreatedEvent event) {
        try {
            // Tạo payload JSON
            NewRecipeRequest newRecipeRequest = event.getNewRecipeRequest();
            String payloadJson = objectMapper.writeValueAsString(
               new PayloadRecipeJson(newRecipeRequest.getTitle(),
                                            newRecipeRequest.getDescription(),
                                            newRecipeRequest.getRecipeIngredients().stream().map(RecipeIngredientRequestDTO::getRawName).collect(Collectors.joining(", ")),
                                            newRecipeRequest.getSteps().stream().map(step -> { return step.getStepNumber() + ": "+step.getDescription();}).collect(Collectors.joining(",")),
                                            event.getImageUrl())
            );

            OutBoxEvent outbox = new OutBoxEvent();
            outbox.setAggregateType("RECIPE");
            outbox.setAggregateId(event.getRecipeId());
            outbox.setEventType("RECIPE_CREATED");
            outbox.setPayload(payloadJson);
            outbox.setProcessed(false);
            outboxRepository.save(outbox);
            System.out.println("Outbox event saved: " + outbox);

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
