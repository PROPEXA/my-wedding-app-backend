package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wedding.app.dto.PrincipalDto;
import org.wedding.app.dto.ResponseDto;
import org.wedding.app.security.AuthUtil;
import org.wedding.app.service.PrincipalService;
import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(WeddingController.WEDDING_CONTROLLER_BASE_URL)
@Tag(name = "Wedding Principals", description = "Endpoints for managing wedding principals")
public class WeddingPrincipalController {

    private final PrincipalService principalService;

    @GetMapping("/{weddingId}/principals")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all wedding principals")
    public ResponseEntity<List<PrincipalDto>> getAllWeddingPrincipals(@PathVariable Integer weddingId) {
        int accountId = AuthUtil.getCurrentUserIdOrThrow();
        return ResponseEntity.ok(
                principalService.obtainPrincipalByWeddingId(weddingId, accountId)
        );
    }

    @GetMapping("/{weddingId}/principals/{principalId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get wedding principal by id")
    public ResponseEntity<PrincipalDto> getWeddingPrincipalById(@PathVariable Integer weddingId, @PathVariable Integer principalId) {
        int accountId = AuthUtil.getCurrentUserIdOrThrow();
        return ResponseEntity.ok(
                principalService.obtainPrincipalByWeddingIdAndPrincipalId(weddingId, principalId, accountId)
        );
    }

    @DeleteMapping("/{weddingId}/principals/{principalId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete wedding principal by id")
    public ResponseEntity<ResponseDto<?>> deleteWeddingPrincipalById(@PathVariable Integer weddingId, @PathVariable Integer principalId) {
        int accountId = AuthUtil.getCurrentUserIdOrThrow();
        principalService.deletePrincipalByWeddingIdAndPrincipalId(weddingId, principalId, accountId);
        return ResponseEntity.ok().body(ResponseDto.builder()
                .code(200)
                .phrase("OK")
                .message("Principal eliminado exitosamente")
                .build());
    }

    @PostMapping("/{weddingId}/principals")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add wedding principal")
    public ResponseEntity<ResponseDto<?>> addWeddingPrincipal(@PathVariable Integer weddingId, @RequestBody List<PrincipalDto> principalsDto) {
        int accountId = AuthUtil.getCurrentUserIdOrThrow();
        principalService.saveNewPrincipals(principalsDto, weddingId, accountId);
        URI uri = URI.create(WeddingController.WEDDING_CONTROLLER_BASE_URL + "/" + weddingId + "/principals");
        return ResponseEntity.created(uri)
                .body(ResponseDto.builder()
                        .code(HttpStatus.CREATED.value())
                        .phrase(HttpStatus.CREATED.getReasonPhrase())
                        .message("Principales agregados exitosamente")
                        .build());
    }

    @PutMapping("/{weddingId}/principals/{principalId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update wedding principal")
    public ResponseEntity<ResponseDto<?>> updateWeddingPrincipal(@PathVariable Integer weddingId,
                                                                 @PathVariable Integer principalId,
                                                                 @RequestBody PrincipalDto principalDto) {
        int accountId = AuthUtil.getCurrentUserIdOrThrow();
        principalService.updatePrincipal(principalDto, weddingId, principalId, accountId);
        return ResponseEntity.ok(
                ResponseDto.builder()
                        .code(HttpStatus.OK.value())
                        .phrase(HttpStatus.OK.getReasonPhrase())
                        .message("Principal actualizado exitosamente")
                        .build());
    }
}
