package com.example.cooking.tools_chatbot;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openapitools.db_data.client.model.Hit;
import org.openapitools.db_data.client.model.SearchRecordsResponse;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.example.cooking.dto.aidto.ToolMetadataContext;
import com.example.cooking.dto.aidto.VectorSearchDTO;
import com.example.cooking.dto.aidto.VectorSearchDTOWithoutImage;
import com.example.cooking.service.PineconeDataService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class QueryTool {
    private final PineconeDataService pineconeDataService;
    private final ToolMetadataContext metadataContext;
    // @Tool(description = "Process a textual query describing one or more
    // ingredients or title, description of recipe and return a list of recipe. Only
    // query by Vietnamese.")
    // public SearchRecordsResponse searchDishesByIngredients(String query) {
    // log.info("Searching dishes by ingredients: {}", query);
    // // Implementation for searching dishes by ingredients
    // SearchRecordsResponse result = pineconeDataService.searchEx(query); //
    // Placeholder return statement
    // metadataContext.setVectorSearchResult(result);
    // metadataContext.getToolsUsing().add(1);
    // return result;
    // }

    // @Tool(description = "Process a textual query describing one or more ingredients or title, description of recipe and return a list of recipe. Only query by Vietnamese.")
    @Tool(description = "The tool returns a list of recipes with associated scores (including both high and low relevance). The model must evaluate the scores and select only the relevant recipes, ignoring results with low or insignificant scores. Only using Vietnamese")
    public VectorSearchDTOWithoutImage searchDishesByIngredients(String query) {
        log.info("Searching dishes by ingredients: {}", query);
        // Implementation for searching dishes by ingredients
        SearchRecordsResponse resultSearch = pineconeDataService.searchExWithRerank(query); // Placeholder return
                                                                                            // statement

        VectorSearchDTO vectorSearchDTO = new VectorSearchDTO();
        vectorSearchDTO.setKeyWord(query);
        vectorSearchDTO.setResult(resultSearch.getResult());
        metadataContext.getToolsUsing().add(1);
        metadataContext.setVectorSearchDTO(vectorSearchDTO);

        VectorSearchDTOWithoutImage vectorSearchDTOWithoutImage = new VectorSearchDTOWithoutImage();
        vectorSearchDTOWithoutImage.setKeyWord(query);
        List<Hit> hitsWithoutImage = new ArrayList<>();

        for (Hit hit : resultSearch.getResult().getHits()) {
            Hit newHit = new Hit();
            newHit.setId(hit.getId());
            newHit.setScore(hit.getScore());
            if (hit.getFields() instanceof Map) {
                try {
                    Map<String, Object> newFields = new HashMap<>((Map<String, Object>) hit.getFields());
                    newFields.remove("imageUrl");
                    newHit.setFields(newFields);
                } catch (Exception e) {
                    log.error("có lỗi khi bỏ thuộc tính imageUrl khỏi map", e);
                }

            } else {
                newHit.setFields(hit.getFields());
            }
            hitsWithoutImage.add(newHit);
        }
        vectorSearchDTOWithoutImage.setResultHit(hitsWithoutImage);
        System.out.println(vectorSearchDTOWithoutImage);

        return vectorSearchDTOWithoutImage;
    }

}
