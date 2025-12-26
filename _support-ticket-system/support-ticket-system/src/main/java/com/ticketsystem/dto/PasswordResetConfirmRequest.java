package com.ticketsystem.dto;

public class PasswordResetConfirmRequest {

    private String email;
    private String token;  // <--- MUST exist (because service calls getToken())
    private String newPassword;

    public PasswordResetConfirmRequest() {}

    public PasswordResetConfirmRequest(String email, String token, String newPassword) {
        this.email = email;
        this.token = token;
        this.newPassword = newPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {         // <--- REQUIRED
        return token;
    }

    public void setToken(String token) { 
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
