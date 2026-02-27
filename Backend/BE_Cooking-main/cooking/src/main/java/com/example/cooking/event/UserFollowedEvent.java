package com.example.cooking.event;

import com.example.cooking.model.User;

public record UserFollowedEvent(User follower,String followerName, User followed) {}