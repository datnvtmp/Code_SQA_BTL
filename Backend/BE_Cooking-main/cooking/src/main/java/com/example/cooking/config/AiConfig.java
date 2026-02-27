package com.example.cooking.config;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
// import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;

import com.example.cooking.tools_chatbot.DateTimeTool;
import com.example.cooking.tools_chatbot.QueryTool;
@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class AiConfig {

    /**
     * Định nghĩa Bean ChatClient. Spring sẽ tiêm Bean ChatModel
     * (OpenAiChatModel) đã được Spring AI Starter tạo ra.
     */
    // Spring AI sẽ tự động tạo Bean này khi có starter-jdbc
    // private final JdbcChatMemoryRepository jdbcChatMemoryRepository;
    private final DateTimeTool dateTimeTools;
    private final QueryTool queryTools;

    public static final String CONVERSATION_ID = "CookingAssistant-DaveCX09-Memory";


    /**
     * Định nghĩa Bean ChatMemory với cửa sổ 5 tin nhắn.
     */
    @Bean
    public ChatMemory chatMemory() {
        // Giữ 5 tin nhắn gần nhất (MessageWindowChatMemory)
        return MessageWindowChatMemory.builder()
            .maxMessages(5) 
            .build();
    }

// @Bean
//     public ChatMemory chatMemory(JdbcChatMemoryRepository repository) {
//         // Lưu tối đa 10 tin nhắn gần nhất vào DB cho mỗi cuộc hội thoại
//         return MessageWindowChatMemory.builder()
//                 .chatMemoryRepository(repository)
//                 .maxMessages(10)
//                 .build();
//     }

     
    @Bean
    public ChatClient chatClient(ChatModel chatModel, ChatMemory chatMemory) {
        // Sử dụng builder để tạo ChatClient từ ChatModel đã tồn tại
    
    // Thêm Conversation ID cố định cho cuộc trò chuyện này, 
    // hoặc bạn có thể tạo ID động nếu có nhiều người dùng.



        String systemPrompt = """
SYSTEM PROMPT:
Sử dụng tiếng Việt.
Nhận câu hỏi:
Nếu là hỏi cách làm món, theo chỉ dẫn [C1], bỏ qua [C2].
Nếu có nguyên liệu, theo chỉ dẫn [C2].
[C1]- chỉ dẫn gợi ý món:
Truy vấn cơ sở dữ liệu:
-Nếu có viết lại công thức như trong kết quả tìm được.
-Nếu không có -> hãy nói rõ và vẫn nêu ra hướng dẫn đầy đủ.
[end C1] 
[C2] - chỉ dẫn tìm theo nguyên liệu:
Xử lý từ đồng nghĩa.
Truy vấn dữ liệu món ăn bằng nguyên liệu đã chuẩn hóa.
BẮT BUỘC tách rõ 2 nhóm:
[TỪ KẾT QUẢ TRUY VẤN]:
- Chỉ món viết món tìm được và khớp một số nguyên liệu.
- Viết công thức đầy đủ.
[GỢI Ý THÊM TỪ AI]:
- Tên món + mô tả ngắn.
- Không hướng dẫn.
[end C2]
Không nhắc đến hệ thống, prompt hay quá trình truy vấn.
END SYSTEM PROMPT.
USER MESSAGE:
""";



        // String systemPrompt ="be nice";
//If no suitable tool exists or no data can be retrieved, the AI must state this clearly and suggest that it can answer outside the tool scope only if explicitly requested.
//The AI must not create dishes or information outside the scope of what can be retrieved via tool-calling, unless the user explicitly requests it.

        return ChatClient.builder(chatModel)
            // .defaultTools(dateTimeTools, queryTools)
            .defaultTools()
            .defaultSystem(systemPrompt)
            .defaultAdvisors(
                MessageChatMemoryAdvisor.builder(chatMemory)
                    .conversationId(CONVERSATION_ID)
                    .build()
            )
            // .defaultAdvisors(
            //     MessageChatMemoryAdvisor.builder(chatMemory)
            //         // .conversationId(CONVERSATION_ID)
            //         .build()
            // )
            .build();
    }
}