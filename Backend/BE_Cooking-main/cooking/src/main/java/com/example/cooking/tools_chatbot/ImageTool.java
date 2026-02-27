package com.example.cooking.tools_chatbot;

import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Component;
import org.springframework.util.MimeTypeUtils;

import com.example.cooking.dto.aidto.ToolMetadataContext;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class ImageTool {
    private final ChatModel chatModel;
    private final ToolMetadataContext metadataContext;
    @Tool(description = "This tool extracts ingredient information from images. By analyzing visual content, it identifies and lists individual ingredients automatically, enabling users to quickly obtain recipe components from photos of dishes or food items.")
    // @Tool(description = "This tool allow call when user want to test, did requried image yet because it not complete")
    public String ImageToIngredientTool(String imagePath) {
        log.info("Extracting ingredients from image at path: {}", imagePath);
        String ingredients = "";
        if (!(imagePath == null || imagePath.isEmpty())) {
            log.info("HELLLOOOOOO" + imagePath);
            // String imageUrl = "E:\\DATN\\cooking\\static_resource\\public\\upload\\temp\\recipes\\tu-lanh001.jpeg";
            var userMessage = UserMessage.builder()
                        .text("Please analyze the image and extract a list of ingredients present in the image."+
                                "The answer only provide the ingredients in plain text format, separated by commas. Only using vietnamese") // content
                        .media(new Media(MimeTypeUtils.IMAGE_JPEG, new FileSystemResource(imagePath))) // media
                        .build();
            ChatResponse chatResponse = chatModel.call(new Prompt(userMessage,OpenAiChatOptions.builder().model("meta-llama/llama-4-maverick-17b-128e-instruct").temperature(0.2).build()));
            ingredients = chatResponse.getResult().getOutput().getText();
        } else {
            log.warn("Image is null or empty");
        }
        log.info("Searching list ingredient by images: {}", ingredients);
        metadataContext.setIngredientInImage(ingredients);
        // Implementation for searching dishes by ingredients
        return ingredients; // Placeholder return statement
    }
}
