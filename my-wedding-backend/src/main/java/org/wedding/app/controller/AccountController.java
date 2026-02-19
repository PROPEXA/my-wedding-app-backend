package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wedding.app.dto.AccountDto;
import org.wedding.app.dto.ConfirmAccount;
import org.wedding.app.dto.ResponseDto;
import org.wedding.app.service.AccountService;

import java.net.URI;

import static org.wedding.app.controller.AccountController.ACCOUNT_CONTROLLER_BASE_URL;

@RestController
@RequestMapping(ACCOUNT_CONTROLLER_BASE_URL)
@RequiredArgsConstructor
@Tag(name = "Cuentas", description = "Operaciones relacionadas con las cuentas")
public class AccountController {

    public static final String ACCOUNT_CONTROLLER_BASE_URL = "/api/v1/accounts";

    private final AccountService accountService;

    @PostMapping
    @Operation(summary = "Crear cuenta")
    public ResponseEntity<ResponseDto<Object>> createNewAccount(@RequestBody
                                                        @Valid AccountDto accountDto) {
        Integer userId = accountService.saveAccount(accountDto);
        URI uri = URI.create(ACCOUNT_CONTROLLER_BASE_URL + "/" + userId);
        return ResponseEntity.created(uri).body(
                ResponseDto.builder()
                        .code(HttpStatus.CREATED.value())
                        .phrase(HttpStatus.CREATED.getReasonPhrase())
                        .message("Cuenta creada exitosamente, por favor revise su correo para confirmar su cuenta")
                        .url(uri.toString())
                        .build()
        );
    }

    @PostMapping("/confirm")
    @Operation(summary = "Confirmar cuenta")
    public ResponseEntity<ResponseDto<Object>> confirmAccount(@Valid @RequestBody ConfirmAccount confirmAccount) {
        accountService.confirmAccount(confirmAccount);
        return ResponseEntity.ok().body(
                ResponseDto.builder()
                        .code(HttpStatus.OK.value())
                        .phrase(HttpStatus.OK.getReasonPhrase())
                        .message("Cuenta confirmada exitosamente")
                        .build()
        );
    }


}
