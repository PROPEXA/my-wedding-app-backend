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
import org.wedding.app.dto.StatisticDto;
import org.wedding.app.service.StatisticService;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/statistics")
@Tag(name = "Statistics", description = "Endpoints for managing statistics")
public class StatisticController {

    private final StatisticService statisticService;

    @GetMapping("/weddings/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get statistics by wedding id")
    public ResponseEntity<StatisticDto> getWeddingStatisticByWeddingId(@PathVariable("id") Integer weddingId) {
        return ResponseEntity.ok(statisticService.obtainWeddingStatisticsByWeddingId(weddingId));
    }

    @GetMapping("/weddings/{id}/events")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get evets statistics by wedding id")
    public ResponseEntity<List<StatisticDto>> getEventsStatisticByWeddingId(@PathVariable("id") Integer weddingId) {
        return ResponseEntity.ok(statisticService.obtainAllEventStatisticsByWeddingId(weddingId));
    }

    @GetMapping("/weddings/events/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get event statistics by event id")
    public ResponseEntity<StatisticDto> getEventStatisticByEventId(@PathVariable("id") Integer eventId) {
        return ResponseEntity.ok(statisticService.obtainEventStatisticsByEventId(eventId));
    }

}
