package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wedding.app.dto.AuthenticationResponse;
import org.wedding.app.dto.ConfirmAccount;
import org.wedding.app.dto.ResponseDto;
import org.wedding.app.dto.UsernamePassword;
import org.wedding.app.service.AuthenticationService;

import static io.swagger.v3.oas.annotations.enums.ParameterIn.HEADER;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación", description = "Operaciones relacionadas con la autenticación de usuarios")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    @Operation(summary = "Autenticarse con credenciales")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody @Valid UsernamePassword usernamePassword) {
        return ResponseEntity.ok(authenticationService.authenticate(usernamePassword));
    }

    @PostMapping("/refresh")
    @Operation(
            summary = "Actualizar token de acceso",
            parameters = @Parameter(
                    name = "X-Refresh",
                    description = "Refresh token",
                    required = true,
                    in = HEADER
            )
    )
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestHeader("X-Refresh") String refreshToken,
                                                               HttpServletRequest request) {
        return ResponseEntity.ok(authenticationService.refreshToken(request));
    }



}
