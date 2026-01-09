package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wedding.app.dto.AccountDto;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.AccountMapper;
import org.wedding.app.model.TblAccount;
import org.wedding.app.repository.TblAccountRepository;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final TblAccountRepository tblAccountRepository;

    @Override
    @Transactional
    public Integer registerNewAccount(AccountDto accountDto) {
        boolean exists = tblAccountRepository.existsByUsername(accountDto.username());
        if (exists) {
            throw new ServiceException(HttpStatus.CONFLICT, "Nombre de usuario se encuentra registrado");
        }
        TblAccount tblAccount = AccountMapper.toEntity(accountDto);
        TblAccount persisted = tblAccountRepository.save(tblAccount);
        log.info("New account register with ID: {} and Username: {}", persisted.getId(), persisted.getUsername());
        return persisted.getId();
    }

    @Override
    public AccountDto getAccountById(Integer id) {
        TblAccount tblAccount = tblAccountRepository.findById(id)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Cuenta no encontrada"));
        return new AccountDto(tblAccount);
    }

    @Override
    public List<AccountDto> getAllAccountsByStatus(boolean status) {
        List<TblAccount> tblAccountList = tblAccountRepository.findByStatus(status);
        if (tblAccountList.isEmpty()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "No hay cuentas registradas");
        }
        return tblAccountList.stream().map(AccountDto::new).toList();
    }

    @Override
    @Transactional
    public void disableAccountById(int accountId) {
        TblAccount tblAccount = tblAccountRepository.findById(accountId)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Cuenta no encontrada"));
        tblAccount.setStatus(false);
        tblAccountRepository.save(tblAccount);
        log.info("Account with ID: {} has been disabled", accountId);
    }
}
