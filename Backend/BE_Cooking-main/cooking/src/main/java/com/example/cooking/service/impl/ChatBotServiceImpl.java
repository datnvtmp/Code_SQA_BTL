package com.example.cooking.service.impl;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.cooking.common.enums.FileType;
import com.example.cooking.dto.aidto.ToolMetadataContext;
import com.example.cooking.service.ChatBotService;
import com.example.cooking.service.UploadFileService;
import com.example.cooking.tools_chatbot.DateTimeTool;
import com.example.cooking.tools_chatbot.ImageTool;
import com.example.cooking.tools_chatbot.QueryTool;

@Service
// @RequiredArgsConstructor
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class ChatBotServiceImpl implements ChatBotService {
    private final ChatClient chatClient;
    private final UploadFileService uploadFileService;
    private final ToolMetadataContext metadataContext;
    private final QueryTool queryTool;
    private final ImageTool imageTool;
    private final DateTimeTool dateTimeTool;
    // public static final String CONVERSATION_ID = "CookingAssistant-DaveCX09-Memory";

    private Map toolMap;

        public ChatBotServiceImpl(ChatClient chatClient,
                              UploadFileService uploadFileService,
                              QueryTool queryTool,
                              ImageTool imageTool,
                              DateTimeTool dateTimeTool,ToolMetadataContext metadataContext) {
        this.chatClient = chatClient;
        this.uploadFileService = uploadFileService;
        this.queryTool = queryTool;
        this.imageTool = imageTool;
        this.dateTimeTool = dateTimeTool;
        this.metadataContext = metadataContext;
        this.toolMap = Map.of(
            1, queryTool,
            2, imageTool,
            3, dateTimeTool
        );
    }



    @Override
    public String getChatBotResponse(String userMessage) {
        // TODO Auto-generated method stub
        String response = chatClient.prompt().user(userMessage).call().content();
        return response;
    }

    
    // public String getChatBotResponseWithToolOLD(String userMessage, AIToolName tools) {
    //     // TODO Auto-generated method stub
    //     String response = "Có lỗi xảy ra khi gọi công cụ AI.";
    //     if (tools == AIToolName.QUERY_VECTOR_DB_TOOL) {
    //         response = chatClient.prompt().user(userMessage).tools(queryTool).call().content();
    //     }   
    //     else if (tools == AIToolName.IMAGE_TO_INGREDIENT_TOOL) {
    //         response = chatClient.prompt().user(userMessage).tools(imageTool).call().content();
    //     }
    //     else if (tools == AIToolName.DATE_TIME_TOOL) {
    //     }

    //     else if (tools == AIToolName.NONE) {
    //         response = chatClient.prompt().user(userMessage).call().content();
    //     }
    //     // String response = chatClient.prompt().user(userMessage).call().content();

    //     return response;
    // }
@Override
public String getChatBotResponseWithTool(String userMessage, List<Integer> toolNumbers, MultipartFile image) {
        
        String ingredientInImage=" ||System: (Log: result from image to ingredient tool) Ingredient from Image is: \""; 
        if (image != null && !image.isEmpty())  {
            String imgUrl = uploadFileService.saveFile(image, FileType.CHAT);
            String relativePath = imgUrl.startsWith("/")
                    ? imgUrl.substring(1)
                    : imgUrl;
            Path path = Paths.get(relativePath).toAbsolutePath();
            System.out.println(path.toString());
            ingredientInImage += imageTool.ImageToIngredientTool(path.toString());
            ingredientInImage += " \".List it extractly as like you just extract it from image, and looking for the recipe that have them";
            metadataContext.getToolsUsing().add(2);
        } else{
                ingredientInImage="";
                // System.out.println("Hit2");
        }
    userMessage = userMessage + " END USER MESSAGE " + ingredientInImage + "END RESULT FROM INGREDIENT TOOL";        
    System.out.println("promt--+++++++--"+ userMessage);
    // === BƯỚC 1: Xử lý NULL và danh sách Rỗng ===
    if (toolNumbers == null || toolNumbers.isEmpty()) {
        // Không dùng tool nếu list là null hoặc rỗng
        return chatClient.prompt().user(userMessage).call().content();
    }
    
    // 2. Lấy danh sách tool object từ toolNumbers
    // Nếu toolNumbers không null, ta mới stream()
    List<Object> selectedTools = toolNumbers.stream()
        .map(toolMap::get) // Lấy tool object từ map
        .filter(t -> t != null) // Lọc bỏ các giá trị không hợp lệ (null) từ toolMap
        .collect(Collectors.toList());

    if (selectedTools.isEmpty()) {
        // Sau khi lọc, nếu danh sách tool vẫn rỗng, không dùng tool
        return chatClient.prompt().user(userMessage).call().content();
    }
    
    // 3. CHUYỂN ĐỔI LIST THÀNH MẢNG (Object[])
    Object[] toolsArray = selectedTools.toArray(new Object[0]); 

    // 4. Gọi chatClient sử dụng vararg

    return chatClient.prompt()
        .user(userMessage)
        .tools(toolsArray)
        // .advisors(a -> a.param(CONVERSATION_ID, 1))
        .call()
        .content();
}
    

    @Override
    public String getChatBotResponseWithImage(String userMessage, MultipartFile image) {
        if (!(image == null || image.isEmpty())) {
            // String imageUrl = uploadFileService.saveTempFile(image, FileType.RECIPE);
            String imageUrl = "E:\\DATN\\cooking\\static_resource\\public\\upload\\temp\\recipes\\tu-lanh001.jpeg";
            String response = chatClient.prompt()
                    .user(u -> u.text(userMessage).media(MimeTypeUtils.IMAGE_PNG, new FileSystemResource(imageUrl)))
                    .call().content();
            return response;
        } else {
            System.out.println("Image is null or empty");
            return null;
        }

    }
}
