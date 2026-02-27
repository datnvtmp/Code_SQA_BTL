package com.example.cooking.service;

import com.example.cooking.common.PageDTO;
import com.example.cooking.dto.UserDTO;
import com.example.cooking.dto.mapper.UserMapper;
import com.example.cooking.event.UserFollowedEvent;
import com.example.cooking.exception.CustomException;
//TODO: Check
import com.example.cooking.model.User;
import com.example.cooking.model.UserFollow;
import com.example.cooking.repository.UserFollowRepository;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final UserFollowRepository userFollowRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void followUser(MyUserDetails currentUser, Long followedId) {
        // Kiểm tra xem followerId và followedId có tồn tại
        User follower = userRepository.getReferenceById(currentUser.getId());
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new CustomException("Followed user not found"));

        // Ngăn tự theo dõi
        if (follower.getId().equals(followedId)) {
            throw new CustomException("Cannot follow yourself");
        }

        // Kiểm tra xem đã follow chưa
        if (userFollowRepository.existsByFollowerIdAndFollowedId(follower.getId(), followedId)) {
            throw new CustomException("Already following this user");
        }

        // Tạo mối quan hệ follow
        UserFollow userFollow = new UserFollow();
        userFollow.setFollower(follower);
        userFollow.setFollowed(followed);
        userFollowRepository.save(userFollow);
        eventPublisher.publishEvent(new UserFollowedEvent(follower, currentUser.getMyUserName(), followed));
    }

    @Transactional
    public void unfollowUser(MyUserDetails currentUser, Long followedId) {
        UserFollow userFollow = userFollowRepository.findByFollowerIdAndFollowedId(currentUser.getId(), followedId)
                .orElseThrow(() -> new CustomException("Follow relationship not found"));
        userFollowRepository.delete(userFollow);
    }

    // new
    public PageDTO<UserDTO> getFollowingUsers(Long userId, Pageable pageable) {
        Page<User> followingPage = userRepository.findFollowingUsers(userId, pageable);
        if (followingPage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        List<UserDTO> following = userMapper.toUserDTOList(followingPage.getContent());
        return new PageDTO<>(followingPage, following);
    }

    //TODO: Xoa
    // holer
    public PageDTO<UserDTO> getPlaceHoder(Pageable pageable) {
        Page<User> followingPage = userRepository.findAll(pageable);
        if (followingPage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        List<UserDTO> following = userMapper.toUserDTOList(followingPage.getContent());
        return new PageDTO<>(followingPage, following);
    }


    public PageDTO<UserDTO> getSuggestChef(Pageable pageable, MyUserDetails userDetails) {
        Page<User> followingPage = userRepository.findSuggestedChefUsers(userDetails.getId(), "CHEF", pageable);
        if (followingPage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        List<UserDTO> following = userMapper.toUserDTOList(followingPage.getContent());
        return new PageDTO<>(followingPage, following);
    }
    public PageDTO<UserDTO> getFollowerUsers(Long userId, Pageable pageable) {
        Page<User> followersPage = userRepository.findFollowerUsers(userId, pageable);
        if (followersPage.isEmpty()) {
            return PageDTO.empty(pageable);
        }
        List<UserDTO> follower = userMapper.toUserDTOList(followersPage.getContent());
        return new PageDTO<>(followersPage, follower);
    }

    public Long countFollowing(Long userId) {
        return userRepository.countFollowing(userId);
    }

    public Long countFollowers(Long userId) {
        return userRepository.countFollowers(userId);
    }

}