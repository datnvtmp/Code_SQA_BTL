package com.example.cooking.common.enums;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

// public enum AIToolName {
//     DATE_TIME_TOOL,
//     QUERY_VECTOR_DB_TOOL,
//     IMAGE_TO_INGREDIENT_TOOL,
//     NONE
// }

public enum AIToolName {
    QUERY_VECTOR_DB_TOOL(1, "Query Vector DB Tool"),
    IMAGE_TO_INGREDIENT_TOOL(2, "Image to Ingredient Tool");
    // DATE_TIME_TOOL(3, "Date Time Tool"),
    // OTHER_TOOL_1(4, "Other Tool 1"),
    // OTHER_TOOL_2(5, "Other Tool 2"),
    // NONE(6, "None");

    private final int id;
    private final String displayName;

    AIToolName(int id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }

    public int getId() { return id; }
    public String getDisplayName() { return displayName; }

    // Map id -> enum
    private static final Map<Integer, AIToolName> ID_MAP =
            Arrays.stream(values()).collect(Collectors.toMap(AIToolName::getId, e -> e));

    public static AIToolName fromId(int id) { return ID_MAP.get(id); }

    // Lấy tên hiển thị theo id
    public static String getDisplayNameById(int id) {
        AIToolName tool = ID_MAP.get(id);
        return tool != null ? tool.getDisplayName() : null; // hoặc "Unknown"
    }
}
