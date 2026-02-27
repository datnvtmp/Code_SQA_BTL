package com.example.cooking.service.admin;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.cooking.common.PageDTO;
import com.example.cooking.common.enums.UserStatus;
import com.example.cooking.dto.UserDTO;
import com.example.cooking.dto.UserRecipeCountDTO;
import com.example.cooking.dto.UserTotalViewCountDTO;
import com.example.cooking.dto.mapper.UserMapper;
import com.example.cooking.dto.projection.TopUserRecipeCount;
import com.example.cooking.dto.projection.TopUserTotalViews;
import com.example.cooking.model.User;
import com.example.cooking.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public PageDTO<UserDTO> searchUsers(String keyword, int page, int size, String sortBy, String sortDir,
            UserStatus status, String role) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String searchKeyword = (keyword == null || keyword.trim().isEmpty()) ? null : keyword.trim();
        String roleFilter = (role == null || role.trim().isEmpty()) ? null : role.trim();

        Page<User> userPage = userRepository.searchUsersByFilters(searchKeyword, status, roleFilter, pageable);

        if (userPage.isEmpty()) {
            return PageDTO.empty(pageable);
        }

        List<UserDTO> userDTOs = userMapper.toUserDTOList(userPage.getContent());
        return new PageDTO<>(userPage, userDTOs);
    }

    public UserDTO updateUserStatus(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setStatus(status);
        userRepository.save(user);
        return userMapper.toUserDTO(user);
    }

    // public UserDTO updateUser(Long userId, UserDTO userDTO) {
    // User user = userRepository.findById(userId)
    // .orElseThrow(() -> new RuntimeException("User not found with id: " +
    // userId));

    // if (userDTO.getUsername() != null)
    // user.setUsername(userDTO.getUsername());
    // // if (userDTO.getEmail() != null)
    // // user.setEmail(userDTO.getEmail());
    // if (userDTO.getBio() != null)
    // user.setBio(userDTO.getBio());
    // if (userDTO.getAvatarUrl() != null)
    // user.setAvatarUrl(userDTO.getAvatarUrl());
    // if (userDTO.getDob() != null)
    // user.setDob(userDTO.getDob());

    // userRepository.save(user);
    // return userMapper.toUserDTO(user);
    // }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        userRepository.delete(user);
    }

    private LocalDateTime getFrom(Integer daysBack, LocalDateTime from) {
        if (from != null)
            return from;
        if (daysBack != null && daysBack > 0) {
            return LocalDateTime.now().minusDays(daysBack);
        }
        return LocalDateTime.of(1970, 1, 1, 0, 0); // toàn bộ thời gian
    }

    private LocalDateTime getTo(LocalDateTime to) {
        return to != null ? to : LocalDateTime.now().plusDays(1);
    }

    public PageDTO<UserRecipeCountDTO> getTopRecipePosters(Integer days, LocalDateTime from, LocalDateTime to, int page, int size) {
        LocalDateTime fromDate = getFrom(days, from);
        LocalDateTime toDate = getTo(to);
        Pageable pageable = PageRequest.of(page, size);
        Page<TopUserRecipeCount> userPage =  userRepository.findTopUsersByRecipeCount(fromDate, toDate, pageable);
        Page<UserRecipeCountDTO> result = userPage.map(item -> {
            UserRecipeCountDTO dto = new UserRecipeCountDTO();
            dto.setUser(userMapper.toUserDTO(item.getUser())); 
            dto.setRecipeCount(item.getRecipeCount());
            return dto;
        });
        if(userPage.isEmpty()){
            return PageDTO.empty(pageable);
        }
        return new PageDTO<>(userPage, result.getContent());

    }

    public PageDTO<UserTotalViewCountDTO> getTopViewedUsers(Integer days, LocalDateTime from, LocalDateTime to, int page, int size) {
        LocalDateTime fromDate = getFrom(days, from);
        LocalDateTime toDate = getTo(to);
        Pageable pageable = PageRequest.of(page, size);
        Page<TopUserTotalViews> userPage =  userRepository.findTopUsersByTotalViews(fromDate, toDate, pageable);
        Page<UserTotalViewCountDTO> result = userPage.map(item -> {
            UserTotalViewCountDTO dto = new UserTotalViewCountDTO();
            dto.setUser(userMapper.toUserDTO(item.getUser())); 
            dto.setTotalViews(item.getTotalViews());
            return dto;
        });
        if(userPage.isEmpty()){
            return PageDTO.empty(pageable);
        }
        return new PageDTO<>(userPage, result.getContent());
    }

}
