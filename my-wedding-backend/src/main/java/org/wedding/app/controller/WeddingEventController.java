package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.wedding.app.dto.EventDto;
import org.wedding.app.dto.ResponseDto;
import org.wedding.app.dto.group.Post;
import org.wedding.app.dto.group.Update;
import org.wedding.app.service.WeddingEventService;

import java.net.URI;
import java.util.List;

import static org.wedding.app.controller.WeddingEventController.EVENT_CONTROLLER_BASE_URL;

@RestController
@RequiredArgsConstructor
@RequestMapping(EVENT_CONTROLLER_BASE_URL)
@Tag(name = "Wedding Events")
public class WeddingEventController {

    private final WeddingEventService weddingEventService;
    public static final String EVENT_CONTROLLER_BASE_URL = "/api/v1/wedding-events";

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create new wedding event")
    public ResponseEntity<ResponseDto<Object>> postNewWeddingEvent(@Validated(Post.class)
                                                                   @RequestBody EventDto dto) {
        int eventId = weddingEventService.saveNewEvent(dto);
        return ResponseEntity.created(buildUri(eventId))
                .body(ResponseDto.builder()
                        .code(HttpStatus.CREATED.value())
                        .phrase(HttpStatus.CREATED.getReasonPhrase())
                        .message("Evento creado exitosamente")
                        .url(buildUri(eventId).toString())
                        .build());
    }

    public URI buildUri(int eventId) {
        return URI.create(EVENT_CONTROLLER_BASE_URL + eventId);
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get wedding event by id")
    public ResponseEntity<EventDto> getWeddingEventById(int id) {
        return ResponseEntity.ok(weddingEventService.obtainEventById(id));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete wedding event")
    public ResponseEntity<ResponseDto<Object>> deleteWeddingEventById(@PathVariable Integer id) {
        weddingEventService.deleteEventById(id);
        return ResponseEntity.ok().body(ResponseDto.builder()
                .code(HttpStatus.OK.value())
                .phrase(HttpStatus.OK.getReasonPhrase())
                .message("Evento eliminado exitosamente")
                .build());
    }

    @PutMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update wedding event")
    public ResponseEntity<ResponseDto<Object>> updateWeddingEvent(@RequestBody @Validated(Update.class) EventDto eventDto) {
        weddingEventService.updateEvent(eventDto);
        return ResponseEntity.ok(ResponseDto.builder()
                .code(HttpStatus.OK.value())
                .phrase(HttpStatus.OK.getReasonPhrase())
                .message("Evento actualizado exitosamente")
                .build());
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all my wedding events by wedding id")
    public ResponseEntity<List<EventDto>> getAllMyWeddingEvents(@RequestParam("wedding_id") Integer weddingId) {
        return ResponseEntity.ok(weddingEventService.obtainAllMyWeddingEvents(weddingId));
    }

}
