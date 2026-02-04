package org.wedding.app.service;

import org.wedding.app.dto.AccountDto;
import org.wedding.app.dto.ConfirmAccount;
import org.wedding.app.dto.PasswordUpd;

public interface AccountService {

    Integer saveAccount(AccountDto accountDto);

    void confirmAccount(ConfirmAccount confirmAccount);

    void updateAccount(AccountDto accountDto);

    void updatePassword(PasswordUpd accountDto);

}
