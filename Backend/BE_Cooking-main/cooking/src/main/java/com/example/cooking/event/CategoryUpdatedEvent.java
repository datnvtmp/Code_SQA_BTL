package com.example.cooking.event;

public class CategoryUpdatedEvent {
    private final Long categoryId;
    public CategoryUpdatedEvent(Long categoryId){this.categoryId = categoryId;}
    public Long getCategoryId(){return categoryId;}

}

