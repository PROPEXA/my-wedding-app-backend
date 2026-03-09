package org.wedding.app.service;

import org.wedding.app.dto.LanguageDto;

import java.util.List;

public interface LanguageService {

    LanguageDto getLanguageByIso6391(String iso6391);

    List<LanguageDto> getAllLanguages();

}
