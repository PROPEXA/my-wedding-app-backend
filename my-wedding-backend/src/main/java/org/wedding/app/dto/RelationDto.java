package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RelationDto(

        @JsonProperty("id")
        Integer id,

        @JsonProperty("description")
        String description
) {
}
