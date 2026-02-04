package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wedding.app.dto.LanguageDto;
import org.wedding.app.service.LanguageService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/languages")
@Tag(name = "Lenguajes", description = "Operaciones relacionadas con los lenguajes")
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping("/{iso6391}")
    @Operation(summary = "Obtener lenguaje ISO-6391")
    public ResponseEntity<LanguageDto> getLanguageByIso6391(@PathVariable String iso6391) {
        return ResponseEntity.ok(languageService.getLanguageByIso6391(iso6391));
    }

    @GetMapping
    @Operation(summary = "Obtener todos los lenguajes")
    public ResponseEntity<List<LanguageDto>> getAllLanguages() {
        return ResponseEntity.ok(languageService.getAllLanguages());
    }

}
