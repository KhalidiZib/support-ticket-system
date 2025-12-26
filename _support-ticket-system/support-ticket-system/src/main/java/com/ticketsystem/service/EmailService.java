package com.ticketsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        if (mailSender == null) {
            System.out.println("Mock email to " + to + " | " + subject + " | " + text);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Password Reset Request";
        String body = "You requested a password reset.\n\n" +
                "Use this code to verify your identity: " + token +
                "\n\nIf you did not request this, you can ignore this message.";

        sendEmail(to, subject, body);
    }
}
