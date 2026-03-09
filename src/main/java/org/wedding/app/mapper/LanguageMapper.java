package org.wedding.app.mapper;

import org.wedding.app.dto.LanguageDto;
import org.wedding.app.model.TblLanguage;

public final class LanguageMapper {

    public static LanguageDto toDto(TblLanguage tblLanguage) {
        return LanguageDto.builder()
                .iso6391(tblLanguage.getIso6391())
                .iso6392(tblLanguage.getIso6392())
                .nativeName(tblLanguage.getNativeName())
                .englishName(tblLanguage.getEnglishName())
                .direction(tblLanguage.getDirection())
                .isActive(tblLanguage.getIsActive())
                .createdAt(tblLanguage.getCreatedAt())
                .updatedAt(tblLanguage.getUpdatedAt())
                .build();
    }

}
