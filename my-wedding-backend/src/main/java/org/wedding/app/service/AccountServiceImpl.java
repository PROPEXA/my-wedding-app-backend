package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wedding.app.dto.AccountDto;
import org.wedding.app.dto.PasswordUpd;
import org.wedding.app.event.AccountCreatedEvent;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.AccountMapper;
import org.wedding.app.mapper.UserMapper;
import org.wedding.app.model.TblAccount;
import org.wedding.app.model.TblLanguage;
import org.wedding.app.model.TblUser;
import org.wedding.app.repository.TblAccountRepository;
import org.wedding.app.repository.TblLanguageRepository;
import org.wedding.app.repository.TblUserRepository;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final TblAccountRepository tblAccountRepository;
    private final TblUserRepository tblUserRepository;
    private final TblLanguageRepository tblLanguageRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public Integer saveAccount(AccountDto accountDto) {
        boolean emailExists = tblAccountRepository.existsByAccEmailIgnoreCase(accountDto.getEmail());
        if (emailExists) {
            throw new ServiceException(HttpStatus.CONFLICT, "Correo electrónico ya fue registrado por otro usuario");
        }
        TblLanguage tblLanguage = tblLanguageRepository.findById(accountDto.getAccountLanguageId())
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Idioma para cuenta no encontrado"));

        TblUser tblUser = UserMapper.toEntity(accountDto.getUser());
        TblUser persisted = tblUserRepository.save(tblUser);

        accountDto.setPassword(passwordEncoder.encode(accountDto.getPassword()));
        TblAccount tblAccount = AccountMapper.toEntity(accountDto);
        tblAccount.setAccUser(persisted);
        tblAccount.setAccLang(tblLanguage);

        TblAccount persistedAccount = tblAccountRepository.save(tblAccount);
        eventPublisher.publishEvent(new AccountCreatedEvent(this, persistedAccount));
        return persistedAccount.getId();
    }

    @Override
    public void updateAccount(AccountDto accountDto) {

    }

    @Override
    public void updatePassword(PasswordUpd accountDto) {

    }

    @Override
    public void confirmEmail(String token) {

    }
}
