package com.ticketsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class TicketCategoryDTO {

    private Long id;

    @NotBlank
    private String name;

    private String description;

    public TicketCategoryDTO() {}

    public TicketCategoryDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
