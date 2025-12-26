package com.ticketsystem.repository;

import com.ticketsystem.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Fetch notifications for a user, ordered by newest first
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId, Pageable pageable);

    // Count unread notifications
    long countByRecipientIdAndIsReadFalse(Long recipientId);

    // Optional: Find top 10 unread
    List<Notification> findTop10ByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId);

    void deleteByRecipientId(Long recipientId);
}
