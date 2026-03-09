package org.wedding.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ConfirmAccount(
        @NotNull(message = "Token es requerido")
        @NotBlank(message = "Token no puede estar vacío")
        String token,

        @NotNull(message = "Código es requerido")
        @NotBlank(message = "Código no puede estar vacío")
        String code
) {
}
