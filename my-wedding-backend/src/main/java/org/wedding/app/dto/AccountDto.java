package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public record AccountDto(
        @JsonProperty("id")
        Integer id,

        @JsonProperty("first_name")
        @NotNull(message = "First name is required")
        String firstName,

        @JsonProperty("last_name")
        String lastName
) {
}
