// package com.example.cooking.service;

// import com.example.cooking.model.Recipe;
// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.meilisearch.sdk.Client;
// import com.meilisearch.sdk.Config;
// import com.meilisearch.sdk.Index;
// import com.meilisearch.sdk.exceptions.MeilisearchException;
// import com.meilisearch.sdk.model.SearchResult;

// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;

// import jakarta.annotation.PostConstruct;
// import java.util.HashMap;
// import java.util.Map;

// @Service
// @RequiredArgsConstructor
// public class MeiliRecipeService {

//     private Client client;
//     private Index index;

//     @PostConstruct
//     public void init() {
//         // Khởi tạo client Meilisearch
//         Config config = new Config("http://127.0.0.1:7700", null); // null nếu không có master key
//         client = new Client(config); // dùng field client, không khai báo mới ở local

//         // Tạo index "recipes" nếu chưa tồn tại
//         try {
//             client.createIndex("recipes", "id"); // "id" là primary key
//         } catch (Exception e) {
//             // Index đã tồn tại → bỏ qua
//         }

//         // Lấy index để thao tác
//         index = client.index("recipes");
//     }

//     public void indexRecipe(Recipe recipe) throws JsonProcessingException  {
//         Map<String, Object> doc = new HashMap<>();
//         doc.put("id", recipe.getId());
//         doc.put("title", recipe.getTitle());
//         doc.put("description", recipe.getDescription());
//         doc.put("tags", recipe.getTags().stream().map(t -> t.getName()).toArray());
//         doc.put("categories", recipe.getCategories().stream().map(c -> c.getName()).toArray());
//         doc.put("ingredients", recipe.getRecipeIngredients().stream().map(i -> i.getRawName()).toArray());

//     ObjectMapper objectMapper = new ObjectMapper();
//     String json = objectMapper.writeValueAsString(doc);

//     index.addDocuments(json);
//     }

//     public SearchResult searchRecipes(String query) {
//     try {
//         return index.search(query); // đơn giản tìm kiếm full-text
//     } catch (MeilisearchException e) {
//         e.printStackTrace();
//         return null;
//     }
// }
// }
