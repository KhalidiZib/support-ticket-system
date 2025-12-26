package com.ticketsystem.dto;

import com.ticketsystem.model.Priority;
import com.ticketsystem.model.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponseDTO {

    private Long id;
    private String title;
    private String description;

    private TicketCategoryDTO category;
    private UserResponseDTO customer;
    private UserResponseDTO assignedAgent;

    private TicketStatus status;
    private Priority priority;

    private LocationDTO location;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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

    public TicketCategoryDTO getCategory() {
        return category;
    }

    public void setCategory(TicketCategoryDTO category) {
        this.category = category;
    }

    public UserResponseDTO getCustomer() {
        return customer;
    }

    public void setCustomer(UserResponseDTO customer) {
        this.customer = customer;
    }

    public UserResponseDTO getAssignedAgent() {
        return assignedAgent;
    }

    public void setAssignedAgent(UserResponseDTO assignedAgent) {
        this.assignedAgent = assignedAgent;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public LocationDTO getLocation() {
        return location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    private List<CommentDTO> comments;

    // ... getters setters

    public List<CommentDTO> getComments() {
        return comments;
    }

    public void setComments(List<CommentDTO> comments) {
        this.comments = comments;
    }
}
