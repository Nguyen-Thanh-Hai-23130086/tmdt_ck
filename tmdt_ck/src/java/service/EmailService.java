package service;

import jakarta.mail.*;
import jakarta.mail.internet.*;

import java.security.SecureRandom;
import java.util.Properties;

public class EmailService {
    private static final SecureRandom RANDOM = new SecureRandom();

    public String generateCode() {
        return String.format("%06d", RANDOM.nextInt(1_000_000));
    }

    public boolean sendVerificationCode(String email, String code) {
        String from = "nguyenthai221204@gmail.com";
        String appPassword = "obom kgws rulo hndw";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
                new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(from, appPassword);
                    }
                });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("TalentMatch - Email Verification");
            message.setText("Your verification code is: " + code + "\nThis code is valid for 15 minutes.");

            Transport.send(message);
            return true;
        } catch (MessagingException e) {
            e.printStackTrace();
            return false;
        }
    }
}