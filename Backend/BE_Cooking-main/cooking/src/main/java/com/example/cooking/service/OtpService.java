package com.example.cooking.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class OtpService {
    private final Map<String, OtpInfo> otpStorage = new HashMap<>();

    private static class OtpInfo {
        String otp;
        LocalDateTime expiry;
        OtpInfo(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStorage.put(email, new OtpInfo(otp, LocalDateTime.now().plusMinutes(5)));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpInfo info = otpStorage.get(email);
        if (info == null) return false;
        if (LocalDateTime.now().isAfter(info.expiry)) {
            otpStorage.remove(email);
            return false;
        }
        boolean match = info.otp.equals(otp);
        if (match) otpStorage.remove(email);
        return match;
    }
}
