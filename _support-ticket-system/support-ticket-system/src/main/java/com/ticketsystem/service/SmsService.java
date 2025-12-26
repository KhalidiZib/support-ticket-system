package com.ticketsystem.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {

    public void sendSms(String phoneNumber, String message) {
        // Here you would integrate with a real SMS provider like Twilio
        System.out.println("Mock SMS to " + phoneNumber + ": " + message);
    }
}
