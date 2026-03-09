package org.wedding.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import static org.wedding.app.audit.AuditAware.AUDIT_AWARE;

@EnableAsync
@EnableCaching
@EnableJpaAuditing(auditorAwareRef = AUDIT_AWARE)
@SpringBootApplication
public class WeddingInvitationsAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(WeddingInvitationsAppApplication.class, args);
    }

}
