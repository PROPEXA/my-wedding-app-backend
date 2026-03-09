package org.wedding.app.notification;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

import static org.wedding.app.config.ThreadPoolConf.THREAD_POOL_NAME;


@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotification extends AbstractEmailNotification {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    String from;

    @Value("${spring.mail.origin}")
    String fromOrigin;

    @Async(THREAD_POOL_NAME)
    public CompletableFuture<Boolean> sendEmailAsync(String to, String subject, String body) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                MimeMessageHelper helper = mimeMessageHelper(javaMailSender);
                helper.setFrom(fromOrigin);
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(body, true);
                javaMailSender.send(helper.getMimeMessage());
                log.info("Correo enviado: From:{}, To:{}, Subject:{}", from, to, subject);
                return true;
            } catch (MessagingException e) {
                log.error("Error al enviar el correo: From:{}, To:{}, Subject:{}", from, to, subject, e);
                return false;
            }
        });
    }
}
