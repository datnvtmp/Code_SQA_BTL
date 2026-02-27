package com.example.cooking.config;

import io.pinecone.clients.Index;
import io.pinecone.configs.PineconeConfig;
import io.pinecone.configs.PineconeConnection;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class PineconeClientConfig {

    @Value("${pinecone.api-key}")
    private String apiKey;

    @Value("${pinecone.host}")
    private String host;

    @Value("${pinecone.index-name}")
    private String indexName;

    /**
     * Bean: Cấu hình Pinecone cơ bản (API Key)
     */
    @Bean
    public PineconeConfig pineconeConfiguration() {
        return new PineconeConfig(apiKey);
    }

    /**
     * Bean: Kết nối Pinecone (Host)
     * Phụ thuộc vào PineconeConfig.
     */
    @Bean
    public PineconeConnection pineconeConnection(PineconeConfig pineconeConfig) {
        // Cần thiết lập host sau khi tạo config
        pineconeConfig.setHost(host);
        return new PineconeConnection(pineconeConfig);
    }

    /**
     * Bean: Đối tượng Index (Điểm tương tác chính)
     * Phụ thuộc vào Config và Connection.
     */
    @Bean
    public Index pineconeIndex(PineconeConfig pineconeConfig, PineconeConnection pineconeConnection) {
        return new Index(pineconeConfig, pineconeConnection, indexName);
    }
}