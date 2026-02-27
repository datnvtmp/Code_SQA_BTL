package com.example.cooking.util;

import org.springframework.stereotype.Component;

import com.example.cooking.config.AppProperties;

@Component
public class UrlUtil {

    private final AppProperties appProperties;

    public UrlUtil(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public String ensureFullUrl(String url) {
        if (url == null || url.isBlank()) {
            return url;
        }
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        return appProperties.getStaticBaseUrl() + url;
    }
}
