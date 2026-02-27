// package com.example.cooking.cheduler;

// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Component;

// import com.example.cooking.dto.payloads.PayloadRecipeJson;
// import com.example.cooking.model.*;
// import com.example.cooking.repository.OutBoxEventRepository;
// import com.example.cooking.service.PineconeDataService;
// import com.fasterxml.jackson.databind.ObjectMapper;

// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;

// @Component
// @Slf4j
// @RequiredArgsConstructor
// @ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
// public class PineconeSyncScheduler {
//     private final OutBoxEventRepository outBoxEventRepository;
//     private final PineconeDataService pineconeDataService;
//     private final ObjectMapper objectMapper;

//     @Scheduled(fixedDelay = 30_000) // 180s
//     public void syncOutboxToPinecone() {
//         log.info("___START SYNC TO PINECONE_VDB___");
//         List<OutBoxEvent> events = outBoxEventRepository.findTop100ByProcessedFalseOrderByCreatedAtAsc();
//         log.info("Find: "+events.size()+" events");
//         if (events.isEmpty()) {
//             return;
//         }
//         try {
//             processEvents(events);
//         } catch (Exception ex) {
//             log.error("Error processing outbox event : {}", ex.getMessage());
//         }
//     }

//     private void processEvents(List<OutBoxEvent> events) throws Exception {
//         // thêm các sự kiện khác nếu có
//         for (OutBoxEvent e : events) {
//             switch (e.getEventType()) {
//                 case "RECIPE_CREATED":
//                     List<Map<String, String>> recipeCreated = new ArrayList<>();
//                     recipeCreated.add(recipeCreatedProcess(e));
//                     pineconeDataService.upsertMapData(recipeCreated);
//                     e.setProcessed(true);
//                     outBoxEventRepository.save(e);
//                     break;
//                 // thêm logic sự kiện khác (xóa, sửa...)
//                 case "RECIPE_UPDATE":
//                     List<Map<String, String>> recipeUpdate = new ArrayList<>();
//                     recipeUpdate.add(recipeCreatedProcess(e));
//                     pineconeDataService.upsertMapData(recipeUpdate);
//                     e.setProcessed(true);
//                     outBoxEventRepository.save(e);
//                     break;
//                 default:
//                     log.warn("Unknown event type: {}", e.getEventType());
//                     break;
//             }

//         }
        
//     }

//     private Map<String, String> recipeCreatedProcess(OutBoxEvent event) throws Exception {
//         PayloadRecipeJson payloadRecipeJson = objectMapper.readValue(event.getPayload(), PayloadRecipeJson.class);

//         String payload = "Món " + payloadRecipeJson.getTitle()
//                 + " có nguyên liệu là "
//                 + payloadRecipeJson.getIngredients()
//                 + " và các bước nấu là "
//                 + payloadRecipeJson.getSteps()
//                 + ". Mô tả: "
//                 + payloadRecipeJson.getDescription();
//         Map<String, String> results = new HashMap<>();
//         results.put("_id", Long.toString(event.getAggregateId()));
//         results.put("title", payloadRecipeJson.getTitle());
//         results.put("text", payload);
//         results.put("imageUrl", payloadRecipeJson.getImageUrl());
//         return results;
//     }
// }
