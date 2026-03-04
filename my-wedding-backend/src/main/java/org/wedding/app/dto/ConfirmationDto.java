package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.wedding.app.dto.enums.ConfirmationType;
import org.wedding.app.dto.group.Post;

import java.util.List;

public record ConfirmationDto(

        @JsonProperty("invitation_id")
        @NotNull(message = "ID de invitación es requerido")
        Integer invitationId,

        @NotBlank(message = "Token es requerido")
        @JsonProperty("token")
        String token,

        @Valid
        @JsonProperty("confirmations")
        @NotEmpty(message = "Confirmaciones son requeridas")
        List<Confirm> confirmations
) {
    public record Confirm(

            @NotNull(message = "ID de evento es requerido")
            @JsonProperty("event_id")
            Integer eventId,

            @NotNull(message = "Tipo de confirmación es requerido")
            @JsonProperty("confirmation_type")
            ConfirmationType confirmationType) {
    }
}
