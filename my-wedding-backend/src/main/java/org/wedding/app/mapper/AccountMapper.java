package org.wedding.app.mapper;

import org.wedding.app.dto.AccountDto;
import org.wedding.app.model.TblAccount;

public final class AccountMapper {

    public static TblAccount toEntity(AccountDto accountDto){
        return TblAccount.builder()
                .role(accountDto.role())
                .username(accountDto.username())
                .password(accountDto.password())
                .build();
    }

}
