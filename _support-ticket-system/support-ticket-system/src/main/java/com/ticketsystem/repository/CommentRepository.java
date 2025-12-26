package com.ticketsystem.repository;

import com.ticketsystem.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);

    // Internal comments (agent only)
    List<Comment> findByTicketIdAndInternalTrueOrderByCreatedAtAsc(Long ticketId);

    // Public (non-internal) comments
    List<Comment> findByTicketIdAndInternalFalseOrderByCreatedAtAsc(Long ticketId);

    Long countByTicketId(Long ticketId);

    Optional<Comment> findFirstByTicketIdOrderByCreatedAtDesc(Long ticketId);

    void deleteByAuthorId(Long authorId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("delete from Comment c where c.ticket.customer.id = :customerId")
    void deleteByTicketCustomerId(@org.springframework.data.repository.query.Param("customerId") Long customerId);
}
