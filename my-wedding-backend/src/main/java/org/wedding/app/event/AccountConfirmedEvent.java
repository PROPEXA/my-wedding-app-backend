package org.wedding.app.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import org.wedding.app.model.TblAccount;

public class AccountConfirmedEvent extends ApplicationEvent {

    @Getter
    private final TblAccount tblAccount;

    public AccountConfirmedEvent(Object source, TblAccount tblAccount) {
        super(source);
        this.tblAccount = tblAccount;
    }
}
