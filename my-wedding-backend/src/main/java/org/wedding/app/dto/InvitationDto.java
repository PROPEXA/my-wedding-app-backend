package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.wedding.app.dto.group.Post;
import org.wedding.app.dto.group.Update;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

public record InvitationDto(

        @JsonProperty("id")
        Integer id,

        @NotBlank(message = "Titulo de invitación no puede estar vacío", groups = {Post.class, Update.class})
        @JsonProperty("title")
        String title,

        @JsonProperty("quantity")
        @NotNull(message = "La cantidad de invitados es requerida", groups = {Post.class, Update.class})
        BigDecimal quantity,

        @JsonProperty("relation_id")
        @NotNull(message = "El código de relación es requerido", groups = {Post.class, Update.class})
        Integer relationId,

        @JsonProperty("relation")
        RelationDto relation,

        @JsonProperty("table_number")
        String tableNumber,

        @JsonProperty("max_date")
        @NotNull(message = "La fecha máxima de confirmación es requerida", groups = {Post.class, Update.class})
        OffsetDateTime maxConfirmation,

        @JsonProperty("registration_date")
        LocalDateTime registrationDate,

        @JsonProperty("modification_date")
        LocalDateTime modificationDate,

        @Valid
        @JsonProperty("guests")
        List<InvitationGuestDto> guests,

        @NotEmpty(message = "Debe seleccionar al menos un evento para asociar a la invitación", groups = {Post.class, Update.class})
        @JsonProperty("events_id")
        List<Integer> eventsId,

        @JsonProperty("events")
        List<EventDto> events,

        String uuid
) {
}
