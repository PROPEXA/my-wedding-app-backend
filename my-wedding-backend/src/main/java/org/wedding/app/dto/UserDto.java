package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Value;
import org.wedding.app.model.TblUser;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO for {@link TblUser}
 */
@Value
@Builder
public class UserDto implements Serializable {

    Integer id;

    @NotNull(message = "Nombres son requeridos")
    @Size(message = "Los nombres deben de ocupar 50 caracteres como máximo", max = 50)
    @NotEmpty(message = "Los nombres no pueden ir en blanco")
    @JsonProperty("first_name")
    String firstName;

    @NotNull(message = "Los apellidos son requeridos")
    @Size(message = "Los apellidos deben de tener un máximo de 50 caracteres", max = 50)
    @NotBlank(message = "Los apellidos no deben de estar en blanco")
    @JsonProperty("last_name")
    String lastName;

    @NotNull(message = "Fecha de nacimiento es requerida")
    @Past(message = "La fecha de nacimiento debe de ser anterior a la fecha actual")
    LocalDate birthdate;

    @JsonProperty("registered_date")
    Instant registeredDate;

    @JsonProperty("modified_date")
    Instant modifiedDate;
}