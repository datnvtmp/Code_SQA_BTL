package com.example.cooking.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import com.example.cooking.config.JwtProperties;
import com.example.cooking.exception.CustomException;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;

@Component
@RequiredArgsConstructor
public class JwtService {
    private final JwtProperties jwtProperties;

    public String generateToken(String subject) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, subject);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .signWith(getSignKey())
                .compact();

    }

    private SecretKey getSignKey() {
        byte[] keyBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, String subject) {
        final String sub = extractSubject(token);
        return (sub.equals(subject) && !isTokenExpired(token));
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /////////// resset passs////////////
    // ///
    // /// // Thêm vào JwtService.java
    // public String generateResetPasswordToken(String email) {
    // Map<String, Object> claims = new HashMap<>();
    // claims.put("type", "RESET_PASSWORD");

    // return Jwts.builder()
    // .claims(claims)
    // .subject(email)
    // .issuedAt(new Date())
    // .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // Fix
    // cứng 15 phút
    // .signWith(getSignKey())
    // .compact();
    // }

    public String generateResetPasswordToken(String email, String userCurrentPasswordHash) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "RESET_PASSWORD");

        // Tạo khóa ký dựa trên Secret mặc định + Hash mật khẩu hiện tại
        SecretKey specializedKey = getSignKey(userCurrentPasswordHash);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
                .signWith(specializedKey) // Sử dụng khóa tùy chỉnh này
                .compact();
    }

    // Khóa ký tùy chỉnh (Cộng thêm hash mật khẩu)
    private SecretKey getSignKey(String extraSecret) {
        String finalSecret = jwtProperties.getSecret() + extraSecret;
        byte[] keyBytes = finalSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Hàm trích xuất Claims cần truyền thêm Password Hash để verify
    private Claims extractAllClaims(String token, String extraSecret) {
        return Jwts.parser()
                .verifyWith(getSignKey(extraSecret)) // Phải khớp với lúc tạo
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Kiểm tra token reset mật khẩu có hợp lệ không
    public boolean validateResetToken(String token, String email, String extraSecret) {
        try {
            final Claims claims = extractAllClaims(token, extraSecret);
            String subject = claims.getSubject();
            boolean isResetType = "RESET_PASSWORD".equals(claims.get("type"));

            return (subject.equals(email) && isResetType && !claims.getExpiration().before(new Date()));
        } catch (Exception e) {
            // Nếu mật khẩu đã đổi, getSignKey sẽ tạo ra key khác -> parse lỗi -> return
            // false
            return false;
        }
    }

}