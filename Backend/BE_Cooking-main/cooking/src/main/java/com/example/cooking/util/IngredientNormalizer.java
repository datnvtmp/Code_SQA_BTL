package com.example.cooking.util;


import java.text.Normalizer;

public class IngredientNormalizer {

    public static String normalizeIngredientName(String raw) {
        if (raw == null) return null;

        String result = raw.trim();
        result = result.toLowerCase(); 

        result = Normalizer.normalize(result, Normalizer.Form.NFD);
        result = result.replaceAll("\\p{M}", "");

        result = result.replaceAll("\\s+", " ");
        result = result.replaceAll("[^a-z0-9 ]", "");

        return result.trim();
    }
}
