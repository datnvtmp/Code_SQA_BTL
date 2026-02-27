package com.example.cooking.service;

import io.pinecone.clients.Index;
import io.pinecone.unsigned_indices_model.QueryResponseWithUnsignedIndices;

import org.springframework.stereotype.Service;

import com.example.cooking.model.Recipe;

import org.openapitools.db_data.client.model.SearchRecordsRequestRerank;
import org.openapitools.db_data.client.model.SearchRecordsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.util.*;
import io.pinecone.unsigned_indices_model.ScoredVectorWithUnsignedIndices; // Cần thêm dòng này
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@ConditionalOnProperty(prefix = "ai.modules.chat", name = "enabled", havingValue = "true", matchIfMissing = false)
public class PineconeDataService {

    private final Index pineconeIndex;

    @Value("${pinecone.namespace}")
    private String defaultNamespace;

    public PineconeDataService(Index pineconeIndex) {
        // Spring tự động tiêm (Auto-inject) Bean Index
        this.pineconeIndex = pineconeIndex;
    }
        // --- Nhập recipe  ---
    public void upsertMapData(List<Map<String, String>> upsertRecords) {
        try {   
            // Thực hiện Upsert. Pinecone sẽ tự động nhúng (embed) văn bản (chunk_text)
            // vì index được cấu hình là "integrated-dense-java"
            log.info("Start connect Pinecone server");
            pineconeIndex.upsertRecords(defaultNamespace, upsertRecords);
           log.info("✅ Upsert done " + upsertRecords.size() + " records into namespace: " + defaultNamespace);
        } catch (Exception e) {
            System.err.println("❌ Error while Upsert: " + e.getMessage());
            e.printStackTrace();
        }
    }






//----------------EXAMPLE------------------

public SearchRecordsResponse searchEx(String query){
    List<String> fields = new ArrayList<>();
    fields.add("_id");
    fields.add("title");
    fields.add("text");
    fields.add("imageUrl");
    try {
    SearchRecordsResponse recordsResponse = pineconeIndex.searchRecordsByText(query, defaultNamespace, fields, 3, null, null);
    return recordsResponse;
    }
    catch (Exception e){
        log.error("Error while search in Pinecone: {}", e.getMessage());
        return null;
    }
}


public SearchRecordsResponse searchExWithRerank(String query) {
    List<String> fields = List.of("_id", "title", "text","imageUrl");
    
    // 1. Cấu hình Rerank
    // Model bge-reranker-v2-m3 hỗ trợ đa ngôn ngữ, rất tốt cho tiếng Việt.
    SearchRecordsRequestRerank rerankConfig = new SearchRecordsRequestRerank()
            .query(query)
            .model("bge-reranker-v2-m3") 
            .topN(3) // Số lượng kết quả cuối cùng muốn lấy sau khi rerank
            .rankFields(List.of("text")); // Field chứa nội dung để model so sánh ngữ nghĩa

    try {
        // 2. Gọi search với tham số rerank
        // Lưu ý: Ta lấy top_k ban đầu là 10 (Retrieve) để Reranker có đủ dữ liệu lọc lại còn 3 (topN)
        SearchRecordsResponse recordsResponse = pineconeIndex.searchRecordsByText(
                query, 
                defaultNamespace, 
                fields, 
                10,           // top_k: số lượng lấy ra ở bước Vector Search
                null,         // filter (nếu có)
                rerankConfig  // tham số Rerank tích hợp
        );
        
        log.info("Search with Rerank successful for query: {}", query);
        return recordsResponse;
    }
    catch (Exception e) {
        log.error("Error while search in Pinecone with Rerank: {}", e.getMessage());
        return null;
    }
}


    // --- Nhập recipe  ---
    public void upsertRecipeData(Recipe recipe) {
        StringBuilder fullText = new StringBuilder();

        // Thêm tên và mô tả
        fullText.append("Món ăn ").append(recipe.getTitle())
                .append(" mô tả là ").append(recipe.getDescription()).append(". ");

        // Thêm tags nếu có
        if (!recipe.getTags().isEmpty()) {
            fullText.append("Tags: ");
            recipe.getTags().forEach(t -> fullText.append(t.getName()).append(", "));
            // Xóa dấu phẩy thừa cuối cùng
            fullText.setLength(fullText.length() - 2);
            fullText.append(". ");
        }

        // Thêm categories nếu có
        if (!recipe.getCategories().isEmpty()) {
            fullText.append("Phân loại: ");
            recipe.getCategories().forEach(c -> fullText.append(c.getName()).append(", "));
            fullText.setLength(fullText.length() - 2);
            fullText.append(". ");
        }

        // Thêm nguyên liệu và ghi chú
        if (!recipe.getRecipeIngredients().isEmpty()) {
            fullText.append("Nguyên liệu: ");
            recipe.getRecipeIngredients().forEach(ri -> {
                fullText.append(ri.getIngredient().getName());
                if (ri.getNote() != null && !ri.getNote().isEmpty()) {
                    fullText.append(" (").append(ri.getNote()).append(")");
                }
                fullText.append(", ");
            });
            fullText.setLength(fullText.length() - 2); // Xóa dấu phẩy cuối
            fullText.append(".");
        }

        // Kết quả
        String resultText = fullText.toString();

        // Tạo các bản ghi mẫu như trong code gốc của bạn
        ArrayList<Map<String, String>> upsertRecords = new ArrayList<>();

        HashMap<String, String> record1 = new HashMap<>();
        record1.put("_id", recipe.getId().toString());
        record1.put("title", recipe.getTitle());
        record1.put("text", resultText);

        // ... Thêm record2, record3, record4 tương tự ...
        
        upsertRecords.add(record1); 
        // upsertRecords.add(record2); ...

        try {
            // Thực hiện Upsert. Pinecone sẽ tự động nhúng (embed) văn bản (chunk_text)
            // vì index được cấu hình là "integrated-dense-java"
            pineconeIndex.upsertRecords(defaultNamespace, upsertRecords);
            System.out.println("✅ Upsert thành công " + upsertRecords.size() + " bản ghi vào namespace: " + defaultNamespace);
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi Upsert: " + e.getMessage());
            e.printStackTrace();
        }
    }






    // --- CHỨC NĂNG UPSERT (Thêm/Cập nhật dữ liệu) ---
    public void upsertSampleData() {
        // Tạo các bản ghi mẫu như trong code gốc của bạn
        ArrayList<Map<String, String>> upsertRecords = new ArrayList<>();

        HashMap<String, String> record1 = new HashMap<>();
        record1.put("_id", "rec1");
        record1.put("category", "digestive system");
        record1.put("text", "Apples are a great source of dietary fiber, which supports digestion and helps maintain a healthy gut.");

        // ... Thêm record2, record3, record4 tương tự ...
        
        upsertRecords.add(record1); 
        // upsertRecords.add(record2); ...

        try {
            // Thực hiện Upsert. Pinecone sẽ tự động nhúng (embed) văn bản (chunk_text)
            // vì index được cấu hình là "integrated-dense-java"
            pineconeIndex.upsertRecords(defaultNamespace, upsertRecords);
            System.out.println("✅ Upsert thành công " + upsertRecords.size() + " bản ghi vào namespace: " + defaultNamespace);
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi Upsert: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // --- CHỨC NĂNG QUERY (Đọc/Tìm kiếm dữ liệu) ---
    // Lưu ý: Đối với index tích hợp embedding, bạn thường cần chuyển đổi văn bản query thành vector
    // bằng một Embedding Service bên ngoài (như Spring AI/OpenAI) trước khi gọi Query.
    // Tuy nhiên, ở đây ta sẽ dùng một vector giả lập để minh họa cú pháp đọc.
   // Ví dụ về cách gọi query() đúng
    public void queryDataByVector(List<Float> queryVectorValues, String namespace, int topK) {
        
        // 1. Định nghĩa các tham số cần thiết
        int topKValue = topK; 
        List<Float> denseVector = queryVectorValues; // Vector của query
        List<Long> sparseIndices = Collections.emptyList(); // Dùng List rỗng nếu không có sparse vector
        List<Float> sparseValues = Collections.emptyList(); // Dùng List rỗng nếu không có sparse vector
        String id = ""; // Đặt ID rỗng nếu bạn query bằng vector (thay vì ID)
        
        // Lọc (filter) - sử dụng Struct từ Google Protobuf, nếu không cần thì để null
        com.google.protobuf.Struct filter = null; 
        boolean includeValues = false; // Có muốn nhận lại vector trong kết quả không
        boolean includeMetadata = true; // Có muốn nhận lại metadata trong kết quả không

        try {
            // 2. GỌI HÀM QUERY ĐÚNG CÚ PHÁP
            // Chú ý: Hàm này trả về QueryResponseWithUnsignedIndices
            QueryResponseWithUnsignedIndices response = pineconeIndex.query(
                topKValue, 
                denseVector, 
                sparseIndices, 
                sparseValues, 
                id, 
                namespace, 
                filter, 
                includeValues, 
                includeMetadata
            );
            
            // 3. Xử lý kết quả
            System.out.println("\n🔎 Kết quả Query (Top " + topK + "):");
            // SAU KHI SỬA (Sử dụng đúng kiểu dữ liệu trả về)
            for (ScoredVectorWithUnsignedIndices vector : response.getMatchesList()) {
                System.out.println("ID: " + vector.getId() 
                                + ", Điểm: " + vector.getScore());
            }
        
        
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi Query: " + e.getMessage());
        }
    }
    

}