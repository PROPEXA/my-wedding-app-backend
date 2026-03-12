package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.wedding.app.dto.enums.Gender;

public record RelationshipDto(

        @JsonProperty("id")
        Integer id,

        @JsonProperty("name")
        String name,

        @JsonProperty("description")
        String description,

        @JsonProperty("gender")
        Gender gender,

        @JsonProperty("is_active")
        Boolean isActive
) {
}
