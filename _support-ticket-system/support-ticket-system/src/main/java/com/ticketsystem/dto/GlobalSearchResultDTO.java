package com.ticketsystem.dto;

public class GlobalSearchResultDTO {

    private String type;
    private Long id;
    private String title;
    private String description;

    // Constructors
    public GlobalSearchResultDTO() {}

    public GlobalSearchResultDTO(String type, Long id, String title, String description) {
        this.type = type;
        this.id = id;
        this.title = title;
        this.description = description;
    }

    // Getters & Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
