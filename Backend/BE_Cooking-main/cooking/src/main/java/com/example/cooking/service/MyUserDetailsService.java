package com.example.cooking.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.cooking.model.User;
import com.example.cooking.repository.UserRepository;
import com.example.cooking.security.MyUserDetails;

import java.util.List;
// import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class MyUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Implement your user loading logic here
        // For example, fetch user from database and return UserDetails object
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));


            // Chuyển RoleEntity sang GrantedAuthority
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .toList();  

        return new MyUserDetails(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getPassword(),
            user.getDob(),
            user.getBio(),
            user.getAvatarUrl(),
            user.getCreatedAt(),
            user.getLastLogin(),
            user.getStatus(),
            authorities);
    }

}
