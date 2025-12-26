package com.ticketsystem.dto;

public class PaginationDTO {

    private int page;
    private int size;

    public PaginationDTO() {}

    public PaginationDTO(int page, int size) {
        this.page = page;
        this.size = size;
    }

    // Getters & Setters
    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}
