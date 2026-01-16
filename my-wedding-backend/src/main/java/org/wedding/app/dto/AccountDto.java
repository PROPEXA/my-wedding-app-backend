package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;
import org.wedding.app.model.TblAccount;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link TblAccount}
 */
@Getter
@Builder
public class AccountDto implements Serializable {

    Integer id;

    @NotNull(message = "Correo es requerido")
    @Size(message = "El correo debe de tener un máximo de 40 caracteres", max = 40)
    @NotBlank(message = "El correo es requirido")
    @Email(message = "Formato de correo invalido")
    String email;

    @JsonProperty("email_confirmed")
    Boolean emailConfirmed;

    @Setter
    @NotNull
    @Size(message = "La contraseña debe de contener un máximo de 35 caracteres", max = 35)
    @NotEmpty(message = "Contraseña es requerida")
    String password;

    Boolean status;

    @JsonProperty("registered_date")
    Instant registeredDate;

    @JsonProperty("modified_date")
    Instant modifiedDate;

    @Valid
    @NotNull
    UserDto user;

    @JsonProperty("account_language_id")
    @NotNull(message = "El idioma de la cuenta es requerido")
    @NotBlank(message = "El idioma de la cuenta es requerido")
    String accountLanguageId;

    @JsonProperty("account_language")
    LanguageDto accountLanguage;
}