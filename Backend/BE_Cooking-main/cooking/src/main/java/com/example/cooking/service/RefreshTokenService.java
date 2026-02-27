package com.example.cooking.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cooking.config.JwtProperties;
import com.example.cooking.exception.CustomException;
import com.example.cooking.model.RefreshToken;
import com.example.cooking.model.User;
import com.example.cooking.repository.RefreshTokenRepository;
import com.example.cooking.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtProperties jwtProperties;
    // Tạo refresh token
    public String createRefreshToken(Long userId) {
        String token = UUID.randomUUID().toString(); // đủ an toàn cho refresh token
        RefreshToken rt = new RefreshToken();
        User user = userRepository.getReferenceById(userId);//TODO: Check xem nên reference hay find
        rt.setUser(user);
        rt.setTokenHash(hashToken(token));

        rt.setIssuedAt(LocalDateTime.now());
        // Lấy thời gian hết hạn từ cấu hình
        long expirationMs = jwtProperties.getRefreshExpiration();
        LocalDateTime expiresAt = LocalDateTime.now().plus(Duration.ofMillis(expirationMs));
        rt.setExpiresAt(expiresAt);
        // Lưu
        refreshTokenRepository.save(rt);
        return token;
    }

    public boolean validateRefreshToken(String token) {
        String tokenHash = hashToken(token);
        Optional<RefreshToken> rt = refreshTokenRepository.findByTokenHash(tokenHash);
        if (rt.isPresent() && rt.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            return true;
        }
        return false;
    }

    public User getUserByRefreshToken(String token) {
        String tokenHash = hashToken(token);
        return refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new CustomException("Invalid refresh token"))
                .getUser();
    }

    @Transactional
    public void deleteRefreshToken(String token) {
        refreshTokenRepository.deleteByTokenHash(hashToken(token));
    }

    @Transactional
    public void deleteAllTokens(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
    @Transactional
    public void deleteAllTokens(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    private String hashToken(String token) {
        return DigestUtils.sha256Hex(token);
    }
}
