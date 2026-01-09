package org.wedding.app.service;

import org.wedding.app.dto.AccountDto;

public interface AccountService {

    Integer registerNewAccount(AccountDto accountDto);

    AccountDto getAccountById(Integer id);
}
