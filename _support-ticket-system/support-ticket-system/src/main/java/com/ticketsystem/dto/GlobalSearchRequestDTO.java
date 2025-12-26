package com.ticketsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class GlobalSearchRequestDTO {

    @NotBlank
    private String query;

    // Getter & Setter
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
