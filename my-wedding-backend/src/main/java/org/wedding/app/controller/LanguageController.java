package org.wedding.app.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wedding.app.dto.LanguageDto;
import org.wedding.app.service.LanguageService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/languages")
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping("/{iso6391}")
    public ResponseEntity<LanguageDto> getLanguageByIso6391(String iso6391) {
        return ResponseEntity.ok(languageService.getLanguageByIso6391(iso6391));
    }

    @GetMapping
    public ResponseEntity<List<LanguageDto>> getAllLanguages() {
        return ResponseEntity.ok(languageService.getAllLanguages());
    }

}
