package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.wedding.app.dto.ConfirmationDto;
import org.wedding.app.dto.InvitationDto;
import org.wedding.app.dto.ResponseDto;
import org.wedding.app.dto.group.Post;
import org.wedding.app.service.WeddingInvitationService;

import java.net.URI;
import java.util.List;

import static org.wedding.app.controller.InvitationController.BASE_URL;

@RestController
@RequiredArgsConstructor
@RequestMapping(BASE_URL)
@Tag(name = "Invitations", description = "Endpoints for managing invitations")
public class InvitationController {

    public static final String BASE_URL = "/api/v1/invitations";

    private final WeddingInvitationService weddingInvitationService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create new invitation")
    public ResponseEntity<ResponseDto<?>> saveNewInvitation(@RequestBody @Validated(Post.class) InvitationDto dto) {
        final int invitationId = weddingInvitationService.saveInvitation(dto);
        final URI uri = buildUri(invitationId);
        return ResponseEntity.created(uri)
                .body(ResponseDto.builder()
                        .code(HttpStatus.CREATED.value())
                        .phrase(HttpStatus.CREATED.getReasonPhrase())
                        .message("Invitación creada exitosamente")
                        .url(uri.toString())
                        .build());
    }

    private URI buildUri(Integer id) {
        return URI.create(BASE_URL + "/" + id);
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get invitation by id")
    public ResponseEntity<InvitationDto> getInvitationById(@PathVariable Integer id) {
        return ResponseEntity.ok(weddingInvitationService.obtainInvitationById(id));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete invitation by id")
    public ResponseEntity<ResponseDto<?>> deleteInvitationById(@PathVariable Integer id) {
        weddingInvitationService.deleteInvitation(id);
        return ResponseEntity.ok(
                ResponseDto.builder()
                        .code(HttpStatus.OK.value())
                        .phrase(HttpStatus.OK.getReasonPhrase())
                        .message("Invitación eliminada exitosamente")
                        .build());
    }

    @GetMapping("/props")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all invitations by event id")
    public ResponseEntity<List<InvitationDto>> getAllInvitationsByEventId(
            @RequestParam("event_id") Integer eventId,
            @ParameterObject @PageableDefault(size = 20, sort = "id") Pageable pageable
    ) {
        return ResponseEntity.ok(weddingInvitationService.obtainAllInvitationsByEventId(eventId, pageable));
    }

    @GetMapping("/{id}/public")
    @Operation(summary = "Get invitation by id and uuid token")
    public ResponseEntity<InvitationDto> getFullInvitationByUuid(@PathVariable Integer id, @RequestParam("uuid") String uuid) {
        return ResponseEntity.ok(weddingInvitationService.obtainInvitationByIdAndUuid(id, uuid));
    }

    @PutMapping("/confirm/public")
    @Operation(summary = "Confirm invitations")
    public ResponseEntity<ResponseDto<?>> putConfirmInvitations(@RequestBody @Valid ConfirmationDto confirmation) {
        weddingInvitationService.confirmInvitation(confirmation);
        return ResponseEntity.ok(ResponseDto.builder()
                .code(HttpStatus.OK.value())
                .phrase(HttpStatus.OK.getReasonPhrase())
                .message("Invitación confirmada exitosamente")
                .build());
    }
}
