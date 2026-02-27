package com.example.cooking.controller;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.UserDTO;
import com.example.cooking.security.MyUserDetails;
//TODO: check
import com.example.cooking.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{followedId}")
    public ResponseEntity<ApiResponse<String>> followUser(@AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long followedId) {
        followService.followUser(currentUser, followedId);
        return ApiResponse.ok("Followed successfully");
    }

    @DeleteMapping("/{followedId}")
    public ResponseEntity<ApiResponse<String>> unfollowUser(@AuthenticationPrincipal MyUserDetails currentUser,
            @PathVariable Long followedId) {
        followService.unfollowUser(currentUser, followedId);
        return ApiResponse.ok("Unfollowed successfully");
    }

    //TODO: Sua lai holder
    @GetMapping("/suggested")
    public  ResponseEntity<ApiResponse<PageDTO<UserDTO>>> getSuggestedFollow(
            @AuthenticationPrincipal MyUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        // return ApiResponse.ok(followService.getPlaceHoder(pageable));
        return ApiResponse.ok(followService.getSuggestChef(pageable, userDetails));
    }

    @GetMapping("/users/{userId}/following")
    public  ResponseEntity<ApiResponse<PageDTO<UserDTO>>> getFollowing(@PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(followService.getFollowingUsers(userId, pageable));
    }
    @GetMapping("/users/{userId}/count-following")
    public  ResponseEntity<ApiResponse<Long>> getCountFollowing(@PathVariable Long userId) {
        return ApiResponse.ok(followService.countFollowing(userId));
    }

    @GetMapping("/users/{userId}/followers")
    public ResponseEntity<ApiResponse<PageDTO<UserDTO>>> getFollowers(@PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.ok(followService.getFollowerUsers(userId, pageable));
    }

    @GetMapping("/users/{userId}/count-followers")
        public ResponseEntity<ApiResponse<Long>> getCountFollowers(@PathVariable Long userId) {
            return ApiResponse.ok(followService.countFollowers(userId));
        }

}