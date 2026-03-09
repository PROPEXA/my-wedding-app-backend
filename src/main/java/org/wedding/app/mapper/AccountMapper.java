package org.wedding.app.mapper;

import org.wedding.app.dto.AccountDto;
import org.wedding.app.model.TblAccount;

public final class AccountMapper {

    public static AccountDto toDto(TblAccount tblAccount) {
        return AccountDto.builder()
                .id(tblAccount.getId())
                .email(tblAccount.getAccEmail())
                .emailConfirmed(tblAccount.getAccEmailconf().equalsIgnoreCase("Y")) // N = No Confirmed
                .status(tblAccount.getAccStatus().equalsIgnoreCase("A"))
                .registeredDate(tblAccount.getAccRegister())
                .modifiedDate(tblAccount.getAccUpdated())
                .build();
    }

    public static TblAccount toEntity(AccountDto accountDto) {
        return TblAccount.builder()
                .accEmail(accountDto.getEmail())
                .accPassword(accountDto.getPassword())
                .accEmailconf("N")
                .accStatus("A")
                .build();
    }

}
