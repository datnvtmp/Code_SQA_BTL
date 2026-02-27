package com.example.cooking.event;

public class TagUpdatedEvent {
    private final Long tagId;
    public TagUpdatedEvent(Long tagId){this.tagId = tagId;};
    public Long getTagId(){return tagId;};
}