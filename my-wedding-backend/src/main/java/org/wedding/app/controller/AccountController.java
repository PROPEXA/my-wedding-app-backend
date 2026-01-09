package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.wedding.app.dto.AccountDto;
import org.wedding.app.dto.ResponseDto;
import org.wedding.app.group.GrpPost;
import org.wedding.app.service.AccountService;

import java.net.URI;
import java.util.List;
import static org.wedding.app.controller.AccountController.BASE_URL;

@RestController
@RequiredArgsConstructor
@RequestMapping(BASE_URL)
public class AccountController {

    public static final String BASE_URL = "/api/v1/accounts";

    private final AccountService accountService;

    @PostMapping
    @Operation(summary = "Registrar una nueva cuenta")
    public ResponseEntity<ResponseDto> registerNewAccount(@Validated(GrpPost.class)
                                                          @RequestBody AccountDto accountDto) {
        int accountId = accountService.registerNewAccount(accountDto);
        URI location = URI.create(BASE_URL + "/" + accountId);
        return ResponseEntity.created(location).body(ResponseDto.builder()
                .code(201)
                .phrase(HttpStatus.CREATED.getReasonPhrase())
                .message("Cuenta creada exitosamente")
                .uri(location.toString())
                .build());
    }

    @GetMapping("/{accountId}")
    @Operation(summary = "Obtener una cuenta por su ID")
    public ResponseEntity<AccountDto> getAccountById(@PathVariable int accountId) {
        return ResponseEntity.ok(accountService.getAccountById(accountId));
    }


    @GetMapping("/props")
    @Operation(summary = "Obtener todas las cuentas activas")
    public ResponseEntity<List<AccountDto>> getAllAccountByStatus(@RequestParam boolean status) {
        return ResponseEntity.ok(accountService.getAllAccountsByStatus(status));
    }

    @DeleteMapping("/{accountId}")
    @Operation(summary = "Deshabilitar una cuenta por su ID")
    public ResponseEntity<Void> disableAccountById(@PathVariable int accountId) {
        accountService.disableAccountById(accountId);
        return ResponseEntity.noContent().build();
    }
}
