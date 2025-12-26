package com.ticketsystem.service;

import com.ticketsystem.model.Comment;
import com.ticketsystem.model.Notification;
import com.ticketsystem.model.Ticket;
import com.ticketsystem.model.User;
import com.ticketsystem.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private com.ticketsystem.repository.UserRepository userRepository;

    public void notifyAdmins(String title, String message) {
        java.util.List<User> admins = userRepository.findByRole(com.ticketsystem.model.UserRole.ADMIN);
        for (User admin : admins) {
            saveNotification(admin, title, message);
        }
    }

    private void saveNotification(User recipient, String title, String message) {
        try {
            Notification n = new Notification(recipient, title, message);
            notificationRepository.save(n);
        } catch (Exception e) {
            System.err.println("Failed to save notification: " + e.getMessage());
        }
    }

    public void notifyNewTicketAssigned(User agent, Ticket ticket) {
        if (agent == null || ticket == null)
            return;

        String title = "New Ticket Assigned: " + ticket.getTitle();
        String body = "Dear " + agent.getName() + ",\n\n" +
                "A new ticket has been assigned to you.\n\n" +
                "Title: " + ticket.getTitle() + "\n" +
                "Description: " + ticket.getDescription() + "\n\n" +
                "Please log in to the system to respond.\n\n" +
                "Support Ticket System";

        // Persist
        saveNotification(agent, title,
                "You have been assigned to ticket #" + ticket.getId() + ": " + ticket.getTitle());

        emailService.sendEmail(agent.getEmail(), title, body);

        if (agent.getPhoneNumber() != null) {
            smsService.sendSms(agent.getPhoneNumber(),
                    "New ticket assigned: " + ticket.getTitle());
        }
    }

    public void notifyTicketStatusChanged(User user, Ticket ticket) {
        if (user == null || ticket == null)
            return;

        String title = "Ticket Status Updated: " + ticket.getTitle();
        String body = "Hello " + user.getName() + ",\n\n" +
                "The status of your ticket \"" + ticket.getTitle() +
                "\" has been updated to: " + ticket.getStatus().name() + ".\n\n" +
                "Please log in for more details.\n\n" +
                "Support Ticket System";

        // Persist
        saveNotification(user, title, "Ticket #" + ticket.getId() + " status updated to " + ticket.getStatus());

        emailService.sendEmail(user.getEmail(), title, body);
    }

    public void notifyTicketComment(User recipient, Ticket ticket, Comment comment) {
        if (recipient == null || ticket == null || comment == null)
            return;

        String title = "New Comment on Ticket: " + ticket.getTitle();
        String body = "Hello " + recipient.getName() + ",\n\n" +
                "There is a new comment on your ticket \"" + ticket.getTitle() + "\":\n\n" +
                comment.getContent() + "\n\n" +
                "Please log in to reply.\n\n" +
                "Support Ticket System";

        // Persist
        saveNotification(recipient, title, "New comment on ticket #" + ticket.getId());

        emailService.sendEmail(recipient.getEmail(), title, body);
    }

    public void notifyPasswordReset(String email, String token) {
        String subject = "Password Reset Request";
        String body = "You requested a password reset.\n\n" +
                "Use this token to reset your password: " + token + "\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Support Ticket System";

        emailService.sendEmail(email, subject, body);
    }
}
