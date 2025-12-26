package com.ticketsystem.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.ticketsystem.dto.TwoFactorResponse;
import com.ticketsystem.model.User;
import com.ticketsystem.repository.UserRepository;
import com.ticketsystem.security.TotpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class TwoFactorAuthService {

    @Autowired
    private UserRepository userRepository;

    @Value("${app.2fa.issuer:SupportTicketSystem}")
    private String issuer;

    public String generateSecret() {
        return TotpUtil.generateSecret();
    }

    public boolean verifyCode(String secret, String code) {
        try {
            int parsed = Integer.parseInt(code);
            return TotpUtil.verifyCode(secret, parsed);
        } catch (Exception e) {
            return false;
        }
    }

    private String buildOtpAuthUrl(String email, String secret) {
        return String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=6&period=30",
                issuer, email, secret, issuer);
    }

    private String generateQrBase64(String otpUrl) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            var bitMatrix = writer.encode(otpUrl, BarcodeFormat.QR_CODE, 300, 300);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", out);

            return Base64.getEncoder().encodeToString(out.toByteArray());
        } catch (Exception e) {
            System.err.println("!!! QR CODE GENERATION FAILED !!!");
            e.printStackTrace();
            throw new RuntimeException("Failed to generate QR code: " + e.getMessage(), e);
        }
    }

    public TwoFactorResponse enableTwoFactor(User user) {
        String secret = generateSecret();

        user.setTwoFactorSecret(secret);
        // user.setTwoFactorEnabled(true); // Don't enable yet!
        user.setTwoFactorEnabled(false);
        userRepository.save(user);

        String otpUrl = buildOtpAuthUrl(user.getEmail(), secret);
        String qrBase64 = generateQrBase64(otpUrl);

        TwoFactorResponse resp = new TwoFactorResponse();
        resp.setEnabled(false); // Not yet enabled
        resp.setSecret(secret);
        resp.setOtpAuthUrl(otpUrl);
        resp.setQrCodeBase64(qrBase64);
        resp.setMessage("Scan this QR in Google Authenticator and enter the code to confirm.");

        return resp;
    }

    public boolean confirmEnableTwoFactor(User user, String code) {
        if (verifyCode(user.getTwoFactorSecret(), code)) {
            user.setTwoFactorEnabled(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public void disableTwoFactor(User user) {
        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        userRepository.save(user);
    }
}
