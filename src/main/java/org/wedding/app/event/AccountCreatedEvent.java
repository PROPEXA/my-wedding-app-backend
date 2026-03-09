package org.wedding.app.event;

import lombok.Getter;
import org.hibernate.Hibernate;
import org.springframework.context.ApplicationEvent;
import org.wedding.app.model.TblAccount;


public class AccountCreatedEvent extends ApplicationEvent {

    @Getter
    private final TblAccount tblAccount;

    public AccountCreatedEvent(Object source, TblAccount tblAccount) {
        super(source);
        // Force
        Hibernate.initialize(tblAccount.getAccUser());
        this.tblAccount = tblAccount;
    }
}
