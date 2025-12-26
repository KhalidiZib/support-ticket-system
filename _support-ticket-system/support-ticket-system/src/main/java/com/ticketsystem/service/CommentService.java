package com.ticketsystem.service;

import com.ticketsystem.dto.CommentDTO;
import com.ticketsystem.dto.UserResponseDTO;
import com.ticketsystem.model.Comment;
import com.ticketsystem.model.Ticket;
import com.ticketsystem.model.User;
import com.ticketsystem.repository.CommentRepository;
import com.ticketsystem.repository.TicketRepository;
import com.ticketsystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public List<CommentDTO> getCommentsByTicket(Long ticketId, boolean includeInternal) {
        List<Comment> comments = includeInternal
                ? commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                : commentRepository.findByTicketIdAndInternalFalseOrderByCreatedAtAsc(ticketId);

        return comments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CommentDTO createComment(CommentDTO dto, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = ticketRepository.findById(dto.getTicketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setContent(dto.getContent());
        comment.setInternal(dto.isInternal());
        comment.setCreatedAt(LocalDateTime.now());

        Comment saved = commentRepository.save(comment);

        User customer = ticket.getCustomer();
        if (customer != null && !customer.getId().equals(author.getId())) {
            notificationService.notifyTicketComment(customer, ticket, saved);
        }

        User agent = ticket.getAssignedAgent();
        if (agent != null && !agent.getId().equals(author.getId())) {
            notificationService.notifyTicketComment(agent, ticket, saved);
        }

        return mapToDTO(saved);
    }

    public CommentDTO updateComment(Long commentId, CommentDTO dto, Long authorId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!Objects.equals(comment.getAuthor().getId(), authorId)) {
            throw new RuntimeException("Forbidden: You can only edit your own comments");
        }

        comment.setContent(dto.getContent());
        Comment saved = commentRepository.save(comment);

        return mapToDTO(saved);
    }

    public void deleteComment(Long commentId, Long authorId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!Objects.equals(comment.getAuthor().getId(), authorId)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    public Long getCommentCountByTicket(Long ticketId) {
        return commentRepository.countByTicketId(ticketId);
    }

    public CommentDTO getLatestCommentByTicket(Long ticketId) {
        return commentRepository.findFirstByTicketIdOrderByCreatedAtDesc(ticketId)
                .map(this::mapToDTO)
                .orElse(null);
    }

    private CommentDTO mapToDTO(Comment c) {
        CommentDTO dto = new CommentDTO();
        dto.setId(c.getId());
        dto.setContent(c.getContent());
        dto.setInternal(c.isInternal());
        dto.setTicketId(c.getTicket().getId());
        dto.setAuthorId(c.getAuthor().getId());
        dto.setAuthorName(c.getAuthor().getName());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    // Optional helper if you later need full author info:
    private UserResponseDTO mapUser(User user) {
        if (user == null)
            return null;
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setEnabled(user.isEnabled());
        return dto;
    }
}
