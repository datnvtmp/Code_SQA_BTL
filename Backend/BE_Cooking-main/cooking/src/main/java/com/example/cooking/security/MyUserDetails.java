package com.example.cooking.security;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.cooking.common.enums.UserStatus;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class MyUserDetails implements UserDetails {
    private Long id;
    private String email;
    private String myUserName;
    private String password;
    private LocalDate dob;
    private String bio;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private UserStatus status;
    private Collection <? extends GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    public String getEmail(){
        return email;
    }

    public UserStatus getStatus(){
        return status;
    }
    
    public String getMyUserName(){
        return myUserName;
    }
    public LocalDate getDob(){
        return dob;
    }
    public String getBio(){
        return bio;
    }

    
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public LocalDateTime getLastLogin(){
        return lastLogin;
    }


    @Override
    public String getPassword() {
        return password;
    }
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.status != UserStatus.BANNED;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.status == UserStatus.ACTIVE;
        // return true;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

}
