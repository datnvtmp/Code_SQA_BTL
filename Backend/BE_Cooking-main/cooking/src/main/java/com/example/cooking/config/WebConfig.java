package com.example.cooking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Nếu bạn lưu file trong folder relative "upload" (System.getProperty("user.dir")/upload)
        String uploadDir = System.getProperty("user.dir") + "/static_resource/public/upload/";
        // Map tất cả /upload/** → folder upload trên filesystem
        registry.addResourceHandler("/static_resource/public/upload/**")
                .addResourceLocations("file:" + uploadDir);
    }
}
