package org.wedding.app.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.wedding.app.notification.EmailNotification;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccountCreatedEventListener {

    private final EmailNotification emailNotification;
    private final TemplateEngine templateEngine;

    @Async
    @EventListener
    public void onApplicationEvent(AccountCreatedEvent event) {
        Context context = new Context();
        final String fullName = event.getTblAccount().getAccUser().getUsrFirstname()
                + " " + event.getTblAccount().getAccUser().getUsrLastname();
        context.setVariable("fullName", fullName);
        String htmlContent = templateEngine.process("layout_email_account_created", context);
        emailNotification.sendEmailAsync(event.getTblAccount().getAccEmail(), "Tu cuenta ha sido creada", htmlContent)
                .join();
    }

}
