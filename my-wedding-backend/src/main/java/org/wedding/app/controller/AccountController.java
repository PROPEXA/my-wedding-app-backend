package org.wedding.app.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wedding.app.dto.AccountDto;
import org.wedding.app.dto.ResponseDto;
import org.wedding.app.service.AccountService;

import java.net.URI;

import static org.wedding.app.controller.AccountController.ACCOUNT_CONTROLLER_BASE_URL;

@RestController
@RequestMapping(ACCOUNT_CONTROLLER_BASE_URL)
@RequiredArgsConstructor
public class AccountController {

    public static final String ACCOUNT_CONTROLLER_BASE_URL = "/api/v1/accounts";

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<ResponseDto> createNewAccount(@RequestBody
                                                        @Valid AccountDto accountDto) {
        Integer userId = accountService.saveAccount(accountDto);
        URI uri = URI.create(ACCOUNT_CONTROLLER_BASE_URL + "/" + userId);
        return ResponseEntity.created(uri).body(
                ResponseDto.builder()
                        .code(HttpStatus.CREATED.value())
                        .phrase(HttpStatus.CREATED.getReasonPhrase())
                        .message("Cuenta creada exitosamente")
                        .url(uri.toString())
                        .build()
        );
    }


}
