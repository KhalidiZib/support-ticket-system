package com.ticketsystem.dto;

import java.util.List;

public class GlobalSearchResponseDTO {

    private List<GlobalSearchResultDTO> results;

    public GlobalSearchResponseDTO() {}

    public GlobalSearchResponseDTO(List<GlobalSearchResultDTO> results) {
        this.results = results;
    }

    public List<GlobalSearchResultDTO> getResults() {
        return results;
    }

    public void setResults(List<GlobalSearchResultDTO> results) {
        this.results = results;
    }
}
