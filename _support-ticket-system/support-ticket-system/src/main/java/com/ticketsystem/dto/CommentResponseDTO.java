package com.ticketsystem.dto;

import lombok.Data;

@Data
public class CommentResponseDTO {

    private Long id;

    private String message;

    private UserResponseDTO author;

    private TicketResponseDTO ticket;

    private String createdAt;
}
