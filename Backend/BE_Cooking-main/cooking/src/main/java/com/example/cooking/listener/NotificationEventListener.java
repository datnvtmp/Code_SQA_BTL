// src/main/java/com/example/cooking/listener/NotificationEventListener.java
package com.example.cooking.listener;

import com.example.cooking.common.enums.NotificationType;
import com.example.cooking.event.*;
import com.example.cooking.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;

//     @Async//old
//     @TransactionalEventListener//old
        @EventListener
        @Transactional
    public void onRecipeLiked(RecipeLikedEvent event) {
        String content = String.format("%s đã thích công thức của bạn: \"%s\"",
                event.actor().getUsername(), event.recipe().getTitle());
        notificationService.create(
                event.recipe().getUser(),
                NotificationType.LIKE,
                content,
                event.recipe(),
                null,
                event.actor()
        );
    }

//     @Async
//     @TransactionalEventListener
        @EventListener
        @Transactional
    public void onRecipeCommented(RecipeCommentedEvent event) {
        String content = String.format("%s đã bình luận về công thức của bạn: \"%s\"",
                event.actor().getUsername(), event.recipe().getTitle());

        notificationService.create(
                event.recipe().getUser(),
                NotificationType.COMMENT,
                content,
                event.recipe(),
                event.comment(),
                event.actor()
        );
    }

//     @Async
//     @TransactionalEventListener
        @EventListener
        @Transactional
    public void onUserFollowed(UserFollowedEvent event) {
        String content = String.format("%s đã theo dõi bạn", event.followerName());

        notificationService.create(
                event.followed(),
                NotificationType.FOLLOW,
                content,
                null,
                null,
                event.follower()
        );
    }
}