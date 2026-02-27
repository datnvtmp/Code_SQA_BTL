package com.example.cooking.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.cooking.exception.CustomException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    @Value("${app.frontend-url}")
    private String frontendUrl;
    private final JavaMailSender mailSender;

    // public void sendResetPasswordEmail(String to, String token) {
    //     String subject = "Đặt lại mật khẩu cho tài khoản Cooking";
    //     // Link này sẽ dẫn tới giao diện Frontend của bạn
    //     String resetLink = frontendUrl + "/reset-password?token=" + token;
        
    //     String content = "Chào bạn,\n\n"
    //             + "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link dưới đây để thực hiện:\n"
    //             + resetLink + "\n\n"
    //             + "Link này sẽ hết hạn sau 15 phút.\n"
    //             + "Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.";

    //     SimpleMailMessage message = new SimpleMailMessage();
    //     message.setFrom("your-email@gmail.com");
    //     message.setTo(to);
    //     message.setSubject(subject);
    //     message.setText(content);

    //     mailSender.send(message);
    // }
    public void sendResetPasswordEmail(String to, String token) {
    String subject = "Đặt lại mật khẩu cho tài khoản Cooking";
    String resetLink = frontendUrl + "/reset-password?token=" + token;

    String htmlContent = """
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <p>Chào bạn,</p>

            <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào nút bên dưới để thực hiện:</p>

            <p>
                <a href="%s"
                   style="
                       display: inline-block;
                       padding: 12px 18px;
                       background-color: #1976d2;
                       color: #ffffff;
                       text-decoration: none;
                       border-radius: 4px;
                       font-weight: bold;
                   ">
                   Đặt lại mật khẩu
                </a>
            </p>

            <p>Link này sẽ hết hạn sau <b>15 phút</b>.</p>

            <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email.</p>

            <hr>
            <p style="font-size: 12px; color: #777;">
                Cooking System
            </p>
        </body>
        </html>
        """.formatted(resetLink);

    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("your-email@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true = HTML

        mailSender.send(message);
    } catch (MessagingException e) {
        throw new CustomException("Gửi email reset mật khẩu thất bại");
    }
}
}