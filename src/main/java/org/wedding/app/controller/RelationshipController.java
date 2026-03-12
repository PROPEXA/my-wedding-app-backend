package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wedding.app.dto.RelationshipDto;
import org.wedding.app.service.RelationshipService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/relationships")
public class RelationshipController {

    private final RelationshipService relationshipService;

    @GetMapping
    @SecurityRequirement( name = "bearerAuth")
    @Operation(summary = "Get all relationships")
    public ResponseEntity<List<RelationshipDto>> getAllRelationships() {
        return ResponseEntity.ok(relationshipService.getAllRelationships());
    }

    @GetMapping("/{id}")
    @SecurityRequirement( name = "bearerAuth")
    @Operation(summary = "Get relationship by id")
    public ResponseEntity<RelationshipDto> getRelationshipById(@PathVariable Integer id) {
        return ResponseEntity.ok(relationshipService.getRelationshipById(id));
    }

}
