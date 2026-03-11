package org.wedding.app.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wedding.app.dto.PrincipalDto;
import org.wedding.app.dto.ResponseDto;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(WeddingController.WEDDING_CONTROLLER_BASE_URL)
@Tag(name = "Wedding Principals", description = "Endpoints for managing wedding principals")
public class WeddingPrincipalController {

    @GetMapping("/{weddingId}/principals")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all wedding principals")
    public ResponseEntity<List<PrincipalDto>> getAllWeddingPrincipals(@PathVariable Integer weddingId) {
        return null;
    }

    @GetMapping("/{weddingId}/principals/{principalId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get wedding principal by id")
    public ResponseEntity<PrincipalDto> getWeddingPrincipalById(@PathVariable Integer weddingId, @PathVariable Integer principalId) {
        return null;
    }

    @DeleteMapping("/{weddingId}/principals/{principalId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete wedding principal by id")
    public ResponseEntity<ResponseDto<?>> deleteWeddingPrincipalById(@PathVariable Integer weddingId, @PathVariable Integer principalId) {
        return null;
    }

    @PostMapping("/{weddingId}/principals")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add wedding principal")
    public ResponseEntity<ResponseDto<?>> addWeddingPrincipal(@PathVariable Integer weddingId, @RequestBody PrincipalDto principalDto) {
        return null;
    }

    @PutMapping("/{weddingId}/principals")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update wedding principal")
    public ResponseEntity<ResponseDto<?>> updateWeddingPrincipal(@PathVariable Integer weddingId, @RequestBody PrincipalDto principalDto) {
        return null;
    }
}
