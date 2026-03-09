package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.wedding.app.dto.LanguageDto;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.LanguageMapper;
import org.wedding.app.model.TblLanguage;
import org.wedding.app.repository.TblLanguageRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageServiceImpl implements LanguageService {

    private final TblLanguageRepository tblLanguageRepository;


    @Override
    public LanguageDto getLanguageByIso6391(String iso6391) {
        return LanguageMapper.toDto(
                tblLanguageRepository.findById(iso6391)
                        .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Idioma no encontrado"))
        );
    }

    @Override
    public List<LanguageDto> getAllLanguages() {
        List<TblLanguage> tblLanguages = tblLanguageRepository.findAll();
        if(tblLanguages.isEmpty()) throw new ServiceException(HttpStatus.NOT_FOUND, "No hay idiomas registrados");
        return tblLanguages.stream().map(LanguageMapper::toDto).toList();
    }
}
