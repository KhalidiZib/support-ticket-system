package com.ticketsystem.controller;

import com.ticketsystem.dto.NotificationDTO;
import com.ticketsystem.model.Notification;
import com.ticketsystem.model.User;
import com.ticketsystem.repository.NotificationRepository;
import com.ticketsystem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuthService authService;

    // Get my notifications
    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getMyNotifications(Pageable pageable) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        Page<Notification> page = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(
                currentUser.getId(), pageable);

        Page<NotificationDTO> dtoPage = page.map(n -> new NotificationDTO(
                n.getId(), n.getTitle(), n.getMessage(), n.isRead(), n.getCreatedAt()));

        return ResponseEntity.ok(dtoPage);
    }

    // Get unread count
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        return ResponseEntity.ok(
                notificationRepository.countByRecipientIdAndIsReadFalse(currentUser.getId()));
    }

    // Mark as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        Notification n = notificationRepository.findById(id).orElse(null);
        if (n == null)
            return ResponseEntity.notFound().build();

        if (!n.getRecipient().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        n.setRead(true);
        notificationRepository.save(n);
        return ResponseEntity.ok().build();
    }

    // Mark all as read
    // (Optional, can be implemented if needed)
}
