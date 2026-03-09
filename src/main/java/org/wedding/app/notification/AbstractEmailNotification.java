package org.wedding.app.notification;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

public abstract class AbstractEmailNotification {

    protected MimeMessageHelper mimeMessageHelper(JavaMailSender javaMailSender) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        message.setHeader("X-Priority", "3");
        message.setHeader("X-MSMail-Priority", "Normal");
        message.setHeader("Importance", "Normal");
        message.setHeader("Content-Type", "text/html; charset=UTF-8");
        return new MimeMessageHelper(message, true, "UTF-8");
    }
}
