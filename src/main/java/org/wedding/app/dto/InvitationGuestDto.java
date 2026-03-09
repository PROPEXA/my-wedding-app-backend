package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import org.wedding.app.dto.group.Post;
import org.wedding.app.dto.group.Update;

public record InvitationGuestDto(
        @JsonProperty("id")
        int id,

        @JsonProperty("email")
        String email,

        @JsonProperty("full_name")
        @NotEmpty(message = "El nombre completo es requerido", groups = {Post.class, Update.class})
        String fullName
) {
}
