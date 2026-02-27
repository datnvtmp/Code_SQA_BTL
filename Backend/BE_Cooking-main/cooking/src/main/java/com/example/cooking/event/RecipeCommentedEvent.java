package com.example.cooking.event;

import com.example.cooking.model.Comment;
import com.example.cooking.model.Recipe;
import com.example.cooking.model.User;

public record RecipeCommentedEvent(User actor, String actorName, Recipe recipe, Comment comment) {}