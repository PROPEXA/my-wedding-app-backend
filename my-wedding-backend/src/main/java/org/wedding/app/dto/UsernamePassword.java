package org.wedding.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsernamePassword(

        @Email(message = "Formato de correo no válido")
        @NotNull(message = "Correo electrónico es requerido")
        @NotBlank(message = "Correo electrónico no puede estar vacío")
        String username,

        @NotNull(message = "Contraseña es requerida")
        @NotBlank(message = "Contraseña no puede estar vacía")
        String password
) {
}
