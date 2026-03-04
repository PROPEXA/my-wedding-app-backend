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
import org.wedding.app.dto.EventTypeDto;
import org.wedding.app.service.WeddingEventTypeService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/wedding-events/types")
@Tag(name = "Event Types", description = "Endpoints for managing wedding event types")
public class EventTypeController {

    private final WeddingEventTypeService weddingEventTypeService;

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all wedding events types")
    public ResponseEntity<List<EventTypeDto>> getAllWeddingEventsTypes() {
        return ResponseEntity.ok(weddingEventTypeService.obtainEventTypeList());
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get wedding event type by id")
    public ResponseEntity<EventTypeDto> getWeddingEventTypeById(@PathVariable Integer id) {
        return ResponseEntity.ok(weddingEventTypeService.obtainEventTypeById(id));
    }
}
