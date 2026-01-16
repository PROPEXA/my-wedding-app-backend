package org.wedding.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Value;
import org.wedding.app.model.TblLanguage;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link TblLanguage}
 */
@Value
@Builder
public class LanguageDto implements Serializable {
    String iso6391;
    String iso6392;

    @JsonProperty("native_name")
    String nativeName;

    @JsonProperty("english_name")
    String englishName;

    String direction;

    @JsonProperty("is_active")
    String isActive;

    @JsonProperty("created_at")
    Instant createdAt;

    @JsonProperty("updated_at")
    Instant updatedAt;
}