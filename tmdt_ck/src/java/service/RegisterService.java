package service;

import dao.UserDao;
import model.User;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

public class RegisterService {
    private static final UserDao userDao = new UserDao();
    private static final EmailService emailService = new EmailService();

    public static String addUser(String email, String password, String name) {
        User user = userDao.findByEmail(email);

        if (user != null) {
            if ("VERIFIED".equals(user.getEmailStatus())) {
                return "EMAIL_VERIFIED";
            }

            String code = emailService.generateCode();
            String codeHash = hashMd5(code);
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

            boolean updated = userDao.updateVerification(
                    email, "PENDING", codeHash, expiresAt
            );

            if (!updated) {
                return "ERROR";
            }

            if (!emailService.sendVerificationCode(email, code)) {
                return "EMAIL_ERROR";
            }

            return "RESEND_CODE";
        }

        String passwordHash = hashMd5(password);
        String code = emailService.generateCode();
        String codeHash = hashMd5(code);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

        boolean added = userDao.addUser(email, passwordHash, name, "PENDING", codeHash, expiresAt);

        if (!added) {
            return "ERROR";
        }

        if (!emailService.sendVerificationCode(email, code)) {
            return "EMAIL_ERROR";
        }

        return "NEW_USER";
    }

    private static String hashMd5(String value) {
        try {
            java.security.MessageDigest md =
                    java.security.MessageDigest.getInstance("MD5");

            byte[] hash = md.digest(
                    value.getBytes(java.nio.charset.StandardCharsets.UTF_8)
            );

            StringBuilder result = new StringBuilder();

            for (byte b : hash) {
                result.append(String.format("%02x", b));
            }

            return result.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}