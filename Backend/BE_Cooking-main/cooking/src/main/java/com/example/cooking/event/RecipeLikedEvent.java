package com.example.cooking.event;

import com.example.cooking.model.Recipe;
import com.example.cooking.model.User;

public record RecipeLikedEvent(User actor, Recipe recipe) {}
