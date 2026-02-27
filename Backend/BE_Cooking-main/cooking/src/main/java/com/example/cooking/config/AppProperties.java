package com.example.cooking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String staticBaseUrl;

    public String getStaticBaseUrl() {
        return staticBaseUrl;
    }

    public void setStaticBaseUrl(String staticBaseUrl) {
        this.staticBaseUrl = staticBaseUrl;
    }
}
