package com.example.cooking.controller.pub;

import java.util.List;
import java.util.Map;

import org.openapitools.db_data.client.model.Hit;
import org.openapitools.db_data.client.model.SearchRecordsResponse;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.cooking.common.ApiResponse;
import com.example.cooking.dto.AIToolDTO;
import com.example.cooking.dto.aidto.ResponeWithMetadata;
import com.example.cooking.dto.aidto.ToolMetadataContext;
import com.example.cooking.dto.aidto.VectorSearchDTO;
import com.example.cooking.service.ChatBotService;
import com.example.cooking.service.ToolService;
import com.example.cooking.util.UrlUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class AIController {
    private final com.example.cooking.service.PineconeDataService pineconeDataService;
    private final ChatBotService chatBotService;
    private final ToolService toolService;
    private final ToolMetadataContext metadataContext;
    private final UrlUtil urlUtil;

    @GetMapping("/pinecone-search")
    public ResponseEntity<ApiResponse<SearchRecordsResponse>> test(@RequestParam String query) {
        return ApiResponse.ok(pineconeDataService.searchEx(query));
    }

    @GetMapping("/chatbot-response")
    public ResponseEntity<?> getChatBotResponse(@RequestParam String message) {
        // String response = chatBotService.getChatBotResponse(message);
        return ApiResponse.ok(chatBotService.getChatBotResponse(message));
    }

    @PostMapping(path = "/chatbot-with-tool-response", consumes = { "multipart/form-data" })
    public ResponseEntity<?> getChatBotWithToolResponse(@RequestParam String userMsg,
            @RequestParam(required = false) List<Integer> toolNumbers,
            @RequestPart(required = false) MultipartFile image) {
        String responseText = chatBotService.getChatBotResponseWithTool(userMsg, toolNumbers, image);
        ResponeWithMetadata responeWithMetadata = new ResponeWithMetadata();
        responeWithMetadata.setResponse(responseText);
        responeWithMetadata.setToolsUsing(metadataContext.getToolsUsing());
        responeWithMetadata.setIngredientInImage(metadataContext.getIngredientInImage());
        responeWithMetadata.setVectorSearchDTO(metadataContext.getVectorSearchDTO());
        if (metadataContext.getVectorSearchDTO() != null) {
            List<Hit> hits = metadataContext.getVectorSearchDTO().getResult().getHits();
            for (Hit hit : hits) {
                Object fieldsObject = hit.getFields();
                if (fieldsObject instanceof Map) {
                    try {
                        Map<String, Object> fieldsMap = (Map<String, Object>) fieldsObject;
                        Object imageUrlObject = fieldsMap.get("imageUrl");
                        if (imageUrlObject instanceof String) {
                            String imageUrl = (String) imageUrlObject;
                            String fullImageUrl = urlUtil.ensureFullUrl(imageUrl);
                            fieldsMap.put("imageUrl", fullImageUrl);
                            hit.setFields(fieldsMap);
                        }
                    } catch (Exception e) {
                        System.err.println("Lỗi khi xử lý fields: " + e.getMessage());
                    }
                }
            }
            responeWithMetadata.getVectorSearchDTO().getResult().setHits(hits);
        }
        // return ApiResponse.ok(chatBotService.getChatBotResponseWithTool(userMsg,
        // toolNumbers, image));
        return ApiResponse.ok(responeWithMetadata);
    }

    @GetMapping("/list")
    public List<AIToolDTO> listTools() {
        return toolService.getAllTools();
    }

    @PostMapping(path = "/chatbot-response-with-image", consumes = { "multipart/form-data" })
    public ResponseEntity<?> getChatBotResponseWithImage(@RequestParam String message,
            @RequestParam(required = false) MultipartFile image) {
        // String response = chatBotService.getChatBotResponse(message);
        return ApiResponse.ok(chatBotService.getChatBotResponseWithImage(message, image));
    }

}
