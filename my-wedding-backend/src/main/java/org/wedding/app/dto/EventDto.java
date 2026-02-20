package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.wedding.app.dto.group.Post;
import org.wedding.app.dto.group.Update;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

/**
 * DTO for {@link org.wedding.app.model.TblEvent}
 */
public record EventDto(

        @JsonProperty("id")
        @NotNull(message = "El id del evento es requerido", groups = Update.class)
        Integer id,

        @JsonProperty("start_date")
        @NotNull(message = "La fecha de inicio es requerida", groups = {Post.class, Update.class})
        OffsetDateTime startDate,

        @JsonProperty("end_date")
        @NotNull(message = "La fecha de fin es requerida", groups = {Post.class, Update.class})
        OffsetDateTime endDate,

        @JsonProperty("title")
        @NotBlank(message = "Titulo de evento es requerido", groups = {Post.class, Update.class})
        String title,

        @JsonProperty("event_type_id")
        @NotNull(message = "El tipo de evento es requerido", groups = {Post.class, Update.class})
        Integer eventTypeId,

        @JsonProperty("event_type")
        EventTypeDto eventType,

        @JsonProperty("address")
        @NotBlank(message = "La dirección del evento es requerida", groups = {Post.class, Update.class})
        String address,

        @JsonProperty("latitude")
        @NotNull(message = "La latitud es requerida", groups = {Post.class, Update.class})
        String longitude,

        @JsonProperty("longitude")
        @NotNull(message = "La longitud es requerida", groups = {Post.class, Update.class})
        String latitude,

        @JsonProperty("sequence")
        BigDecimal sequence,

        @JsonProperty("wedding_id")
        @NotNull(message = "El código de boda es requerida", groups = {Post.class, Update.class})
        Integer weddingId,

        @JsonProperty("wedding")
        WeddingDto wedding,

        @JsonProperty("registration_date")
        LocalDateTime registrationDate,

        @JsonProperty("modification_date")
        LocalDateTime modificationDate,

        @JsonProperty("is_active")
        Boolean isActive
) {
}