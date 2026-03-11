package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.wedding.app.dto.PrincipalDto;
import org.wedding.app.dto.ResponseDto;
import org.wedding.app.dto.WeddingDto;
import org.wedding.app.dto.group.Post;
import org.wedding.app.dto.group.Update;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.security.AuthUtil;
import org.wedding.app.service.WeddingService;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(WeddingController.WEDDING_CONTROLLER_BASE_URL)
@Tag(name = "Weddings", description = "Endpoints for managing weddings")
public class WeddingController {

    private final WeddingService weddingService;
    public static final String WEDDING_CONTROLLER_BASE_URL = "/api/v1/weddings";

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create new wedding")
    public ResponseEntity<ResponseDto<Object>> postWedding(@Validated(Post.class)
                                                           @RequestBody
                                                           WeddingDto weddingDto
    ) {
        int accountId = AuthUtil.getCurrentUserId().orElseThrow(() -> new ServiceException(
                HttpStatus.BAD_REQUEST,
                "No se pudo verificar la identidad del usuario"
        ));
        int weddingId = weddingService.saveWedding(weddingDto, accountId);
        return ResponseEntity.created(buildUri(weddingId))
                .body(ResponseDto.builder()
                        .code(HttpStatus.CREATED.value())
                        .phrase(HttpStatus.CREATED.getReasonPhrase())
                        .message("Boda creada exitosamente")
                        .url(buildUri(weddingId).toString())
                        .build());
    }

    private URI buildUri(Integer id) {
        return URI.create(WEDDING_CONTROLLER_BASE_URL + "/" + id);
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get wedding by id")
    public ResponseEntity<WeddingDto> getWeddingById(@PathVariable Integer id) {
        return ResponseEntity.ok(weddingService.obtainWeddingById(id));
    }

    @DeleteMapping("/{weddingId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Disable wedding")
    public ResponseEntity<ResponseDto<Object>> disableWedding(@PathVariable Integer weddingId) {
        int accountId = AuthUtil.getCurrentUserId()
                .orElseThrow(() -> new ServiceException(
                        HttpStatus.BAD_REQUEST,
                        "No se pudo verificar la identidad del usuario al eliminar la boda"));
        weddingService.deleteWeddingById(weddingId, accountId);
        return ResponseEntity.ok().body(ResponseDto.builder()
                .code(HttpStatus.OK.value())
                .phrase(HttpStatus.OK.getReasonPhrase())
                .message("Boda eliminada exitosamente")
                .build());
    }

    @PutMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update wedding")
    public ResponseEntity<ResponseDto<Object>> updateWedding(@Validated(Update.class)
                                                             @RequestBody
                                                             WeddingDto weddingDto) {
        int accountId = AuthUtil.getCurrentUserId()
                .orElseThrow(() -> new ServiceException(
                        HttpStatus.BAD_REQUEST,
                        "No se pudo verificar la identidad del usuario"));
        weddingService.updateWedding(weddingDto, accountId);
        return ResponseEntity.ok(
                ResponseDto.builder()
                        .code(HttpStatus.OK.value())
                        .phrase(HttpStatus.OK.getReasonPhrase())
                        .message("Boda actualizada exitosamente")
                        .build()
        );
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all my weddings and filter by status")
    public ResponseEntity<List<WeddingDto>> getAllMyWeddings(
            @RequestParam(
                    name = "status",
                    required = false,
                    defaultValue = "A")
            String status) {
        int accountId = AuthUtil.getCurrentUserId()
                .orElseThrow(() -> new ServiceException(
                        HttpStatus.BAD_REQUEST,
                        "No se pudo verificar la identidad del usuario al obtener las bodas"));
        return ResponseEntity.ok(weddingService.obtainAllMyWeddingsByStatus(accountId, status));
    }
}
