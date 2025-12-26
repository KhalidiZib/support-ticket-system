package com.ticketsystem.controller;

import com.ticketsystem.dto.CommentDTO;
import com.ticketsystem.model.User;
import com.ticketsystem.service.AuthService;
import com.ticketsystem.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private AuthService authService;

    // Get comments for a ticket
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<CommentDTO>> getComments(
            @PathVariable Long ticketId,
            @RequestParam(defaultValue = "false") boolean includeInternal
    ) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        // Optionally you could enforce permission here to see internal comments.
        List<CommentDTO> comments =
                commentService.getCommentsByTicket(ticketId, includeInternal);
        return ResponseEntity.ok(comments);
    }

    // Add a new comment
    @PostMapping
    public ResponseEntity<CommentDTO> addComment(
            @Valid @RequestBody CommentDTO dto
    ) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        CommentDTO created =
                commentService.createComment(dto, currentUser.getId());
        return ResponseEntity.ok(created);
    }

    // Update own comment
    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentDTO dto
    ) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        CommentDTO updated =
                commentService.updateComment(id, dto, currentUser.getId());
        return ResponseEntity.ok(updated);
    }

    // Delete own comment (admin can also be allowed if desired)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        commentService.deleteComment(id, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    // Count comments for a ticket
    @GetMapping("/ticket/{ticketId}/count")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<Long> countComments(@PathVariable Long ticketId) {
        Long count = commentService.getCommentCountByTicket(ticketId);
        return ResponseEntity.ok(count);
    }

    // Latest comment for a ticket
    @GetMapping("/ticket/{ticketId}/latest")
    public ResponseEntity<CommentDTO> latestComment(@PathVariable Long ticketId) {
        CommentDTO dto = commentService.getLatestCommentByTicket(ticketId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }
}
