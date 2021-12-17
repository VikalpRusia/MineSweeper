package com.miniProject.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;

@Repository
public class SimpleMailServices implements MailServices {
    private final String fromEmail;
    private final String password;
    private final Session session;

    @Autowired
    public SimpleMailServices(@Value("${my-email}") String fromEmail,
                              @Value("${my-email-password}") String password,
                              @Value("${smtp-host}") String smtpHost) {
        this.fromEmail = fromEmail;
        this.password = password;
        Properties props = new Properties();
        props.put("mail.smtp.host", smtpHost); //SMTP Host
        props.put("mail.smtp.port", "587"); //TLS Port
        props.put("mail.smtp.auth", "true"); //enable authentication
        props.put("mail.smtp.starttls.enable", "true"); //enable STARTTLS
        Authenticator auth = new Authenticator() {
            //override the getPasswordAuthentication method
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        };
        session = Session.getInstance(props, auth);
    }

    @Override
    public CompletableFuture<Boolean> sendMail(String username, String recipient, String heading, String content) {
        MimeMessage message = new MimeMessage(session);
        try {
            message.setFrom(new InternetAddress(fromEmail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
            message.setSubject(heading);
            message.setText(content);
            Transport.send(message);
            return CompletableFuture.completedFuture(true);
        } catch (MessagingException e) {
            e.printStackTrace();
            return CompletableFuture.completedFuture(false);
        }
    }

    @Override
    public CompletableFuture<Boolean> sendVerificationMail(String username, String recipient) {
        return sendMail(username, recipient, "welcome", "test");
    }
}
