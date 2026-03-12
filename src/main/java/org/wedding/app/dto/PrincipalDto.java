package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.wedding.app.dto.enums.PrincipalType;
import org.wedding.app.dto.group.Post;
import org.wedding.app.dto.group.Update;

import java.time.Instant;
import java.time.LocalDate;

public record PrincipalDto(

        @NotNull(message = "El identificador del principal es requerido", groups = {Update.class})
        @JsonProperty("id")
        Integer id,

        @NotNull(message = "El tipo de principal es requerido, GROOM, BRIDE", groups = {Post.class, Update.class})
        @JsonProperty("type")
        PrincipalType type,

        @NotBlank(message = "El nombre es requerido", groups = {Post.class, Update.class})
        @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres", groups = {Post.class, Update.class})
        @JsonProperty("first_name")
        String firstName,

        @NotBlank(message = "El apellido es requerido", groups = {Post.class, Update.class})
        @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres", groups = {Post.class, Update.class})
        @JsonProperty("last_name")
        String lastName,

        @JsonProperty("birth_date")
        LocalDate birthDate,

        @JsonProperty("email")
        String email,

        @JsonProperty("phone")
        String phone,

        @JsonProperty("register")
        Instant register,

        @JsonProperty("updated")
        Instant updated,

        @JsonProperty("is_active")
        Boolean isActive,

        @JsonProperty("wedding_id")
        Integer weddingId,

        @NotNull(message = "Código de tipo de relación es requerido", groups = {Post.class, Update.class})
        @JsonProperty("relationship_id")
        Integer relationshipId,

        @JsonProperty("relationship")
        RelationshipDto relationship
) {
}
