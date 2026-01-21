package org.wedding.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableJpaAuditing
@SpringBootApplication
public class WeddingInvitationsAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(WeddingInvitationsAppApplication.class, args);
	}

}
