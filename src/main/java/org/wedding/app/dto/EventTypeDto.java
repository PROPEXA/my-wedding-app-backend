package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

public record EventTypeDto(

        @JsonProperty("id")
        Integer id,

        @JsonProperty("event_name")
        String eventName,

        @JsonProperty("registration_date")
        LocalDateTime registrationDate,

        @JsonProperty("modification_date")
        LocalDateTime modificationDate
) {
}
