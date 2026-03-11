package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import org.wedding.app.dto.group.Post;
import org.wedding.app.dto.group.Update;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link org.wedding.app.model.TblWedding}
 */
public record WeddingDto(

        @NotNull(message = "El id de la boda es requerido", groups = Update.class)
        @JsonProperty("id")
        Integer id,

        @JsonProperty("account_id")
        Integer accountId,

        @JsonProperty("bride_firstname")
        @NotNull(message = "El nombre de la novia es requerido", groups = {Post.class, Update.class})
        String brideFirstname,

        @JsonProperty("bride_lastname")
        @NotNull(message = "El apellido de la novia es requerido", groups = {Post.class, Update.class})
        String brideLastname,

        @JsonProperty("bride_birthdate")
        @NotNull(message = "La fecha de nacimiento de la novia es requerida", groups = {Post.class, Update.class})
        @Past(message = "La fecha de nacimiento de la novia debe de ser anterior a la fecha actual", groups = {Post.class, Update.class})
        LocalDate brideBirthdate,

        @JsonProperty("bride_email")
        @NotNull(message = "El correo de la novia es requerido", groups = {Post.class, Update.class})
        @Email(message = "Formato de correo invalido", groups = {Post.class, Update.class})
        String brideEmail,

        @JsonProperty("bride_phone")
        @NotNull(message = "El teléfono de la novia es requerido", groups = {Post.class, Update.class})
        String bridePhone,

        @JsonProperty("groom_firstname")
        @NotNull(message = "El nombre del novio es requerido", groups = {Post.class, Update.class})
        String groomFirstname,

        @JsonProperty("groom_lastname")
        @NotNull(message = "El apellido del novio es requerido", groups = {Post.class, Update.class})
        String groomLastname,

        @JsonProperty("groom_birthdate")
        @NotNull(message = "La fecha de nacimiento del novio es requerida", groups = {Post.class, Update.class})
        @Past(message = "La fecha de nacimiento del novio debe de ser anterior a la fecha actual", groups = {Post.class, Update.class})
        LocalDate groomBirthdate,

        @JsonProperty("groom_email")
        @NotNull(message = "El correo del novio es requerido", groups = {Post.class, Update.class})
        @Email(message = "Formato de correo invalido", groups = {Post.class, Update.class})
        String groomEmail,

        @JsonProperty("groom_phone")
        @NotNull(message = "El teléfono del novio es requerido", groups = {Post.class, Update.class})
        String groomPhone,

        @JsonProperty("registration_date")
        LocalDateTime registrationDate,

        @JsonProperty("modification_date")
        LocalDateTime modificationDate,

        @JsonProperty("is_active")
        Boolean isActive,

        @JsonProperty("principals")
        List<PrincipalDto> principals

) {
}
