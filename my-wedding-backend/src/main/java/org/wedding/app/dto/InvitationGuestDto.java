package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InvitationGuestDto(
        @JsonProperty("id")
        int id,

        @JsonProperty("email")
        String email,

        @JsonProperty("full_name")
        String fullName
) {
}
