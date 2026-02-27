package com.example.cooking.listener;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.example.cooking.event.RecipeUpdatedEvent;
import com.example.cooking.event.TagUpdatedEvent;
import com.example.cooking.repository.RecipeRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TagUpdateListener {

    private final RecipeRepository recipeRepo;
    private final ApplicationEventPublisher eventPublisher;

    @EventListener
    public void onTagUpdated(TagUpdatedEvent event) {
        // Tìm tất cả recipe có tag này
        // List<Long> recipeIds = recipeRepo.findIdsByTagId(event.getTagId());
        // recipeIds.forEach(id ->
        //     eventPublisher.publishEvent(new RecipeUpdatedEvent(id))
        // );
    }
}
