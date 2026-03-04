package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wedding.app.dto.RelationDto;
import org.wedding.app.service.RelationService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/relations")
@RequiredArgsConstructor
@Tag(name = "Relations", description = "Endpoints for managing relations")
public class RelationController {

    private final RelationService relationService;

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get relation by id")
    public ResponseEntity<RelationDto> getRelationById(@PathVariable Integer id) {
        return ResponseEntity.ok(
                relationService.getRelationById(id)
        );
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all relations")
    public ResponseEntity<List<RelationDto>> getAllRelations() {
        return ResponseEntity.ok(
                relationService.getAllRelations()
        );
    }
}
