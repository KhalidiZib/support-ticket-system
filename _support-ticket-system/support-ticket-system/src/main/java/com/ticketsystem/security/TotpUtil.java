package com.ticketsystem.security;

import org.apache.commons.codec.binary.Base32;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.time.Instant;

public class TotpUtil {

    private static final int SECRET_SIZE = 20; // 160-bit
    private static final int TIME_STEP_SECONDS = 30;
    private static final int TOTP_DIGITS = 6;
    private static final String HMAC_ALGO = "HmacSHA1";

    public static String generateSecret() {
        byte[] buffer = new byte[SECRET_SIZE];
        new SecureRandom().nextBytes(buffer);

        Base32 base32 = new Base32();
        return base32.encodeToString(buffer).replace("=", "");
    }

    public static boolean verifyCode(String secret, int code) {
        long timeWindow = Instant.now().getEpochSecond() / TIME_STEP_SECONDS;

        // allow small time drift: window-1, window, window+1
        for (int i = -1; i <= 1; i++) {
            int generated = generateCode(secret, timeWindow + i);
            if (generated == code) {
                return true;
            }
        }
        return false;
    }

    public static boolean verifyCode(String secret, String codeStr) {
        try {
            int code = Integer.parseInt(codeStr);
            return verifyCode(secret, code);
        } catch (NumberFormatException ex) {
            return false;
        }
    }

    private static int generateCode(String secret, long timeWindow) {
        Base32 base32 = new Base32();
        byte[] key = base32.decode(secret);

        byte[] data = ByteBuffer.allocate(8).putLong(timeWindow).array();

        try {
            Mac mac = Mac.getInstance(HMAC_ALGO);
            mac.init(new SecretKeySpec(key, HMAC_ALGO));
            byte[] hash = mac.doFinal(data);

            int offset = hash[hash.length - 1] & 0x0F;
            int binary =
                    ((hash[offset] & 0x7f) << 24) |
                    ((hash[offset + 1] & 0xff) << 16) |
                    ((hash[offset + 2] & 0xff) << 8) |
                    (hash[offset + 3] & 0xff);

            int otp = binary % (int) Math.pow(10, TOTP_DIGITS);
            return otp;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate TOTP", e);
        }
    }
}
