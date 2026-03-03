package org.wedding.app.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.RandomStringGenerator;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.wedding.app.model.TblAccount;
import org.wedding.app.model.TblAccountConfirmation;
import org.wedding.app.notification.EmailNotification;
import org.wedding.app.repository.TblAccountConfirmationRepository;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class AccountEventListener {

    private final EmailNotification emailNotification;
    private final TemplateEngine templateEngine;
    private final PasswordEncoder passwordEncoder;
    private final TblAccountConfirmationRepository tblAccountConfirmationRepository;
    private final RandomStringGenerator randomStringGenerator = new RandomStringGenerator.Builder()
            .withinRange('0', 'Z').filteredBy(Character::isLetterOrDigit)
            .get();

    @Async
    @EventListener
    public void onAccountCreatedEvent(AccountCreatedEvent event) {
        notifyAccountCreated(event);
        notifyConfirmAccount(event.getTblAccount());
    }

    private void notifyAccountCreated(AccountCreatedEvent event) {
        Context context = new Context();
        context.setVariable("fullName", getFullName(event.getTblAccount()));
        String htmlContent = templateEngine.process("layout_email_account_created", context);
        emailNotification.sendEmailAsync(event.getTblAccount().getAccEmail(), "Tu cuenta ha sido creada", htmlContent)
                .join();
    }

    private void notifyConfirmAccount(TblAccount tblAccount) {
        final String confirmationConde = randomStringGenerator.generate(6).toUpperCase();
        final String uuid = UUID.randomUUID().toString();
        tblAccountConfirmationRepository.save(TblAccountConfirmation.builder()
                .id(uuid)
                .accessCode(passwordEncoder.encode(confirmationConde))
                .accountId(tblAccount.getId())
                .build());
        Context context = new Context();
        context.setVariable("fullName", getFullName(tblAccount));
        context.setVariable("confirmationCode", confirmationConde);
        context.setVariable("fullUrl", "http://localhost:4200/auth/confirm/" + uuid);
        String htmlContent = templateEngine.process("layout_email_confirm_account", context);
        emailNotification.sendEmailAsync(tblAccount.getAccEmail(), "Confirma tu cuenta", htmlContent)
                .join();
    }

    private String getFullName(TblAccount tblAccount) {
        return tblAccount.getAccUser().getUsrFirstname()
                + " " + tblAccount.getAccUser().getUsrLastname();
    }

    @Async
    @EventListener
    public void onAccountConfirmedEvent(AccountConfirmedEvent event) {
        Context context = new Context();
        context.setVariable("fullName", getFullName(event.getTblAccount()));
        String htmlContent = templateEngine.process("layout_email_account_confirmed", context);
        emailNotification.sendEmailAsync(event.getTblAccount().getAccEmail(), "Tu cuenta ha sido confirmada", htmlContent)
                .join();
    }
}
