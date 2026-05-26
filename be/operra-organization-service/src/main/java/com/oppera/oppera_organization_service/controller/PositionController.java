package com.oppera.oppera_organization_service.controller;

import com.oppera.oppera_organization_service.dto.request.PositionRequest;
import com.oppera.oppera_organization_service.dto.response.PositionResponse;
import com.oppera.oppera_organization_service.service.PositionService;
import com.operra.operra_common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/positions")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PositionController {
    PositionService positionService;

    @PostMapping
    ApiResponse<PositionResponse> createPosition(@RequestBody @Valid PositionRequest request) {
        return ApiResponse.<PositionResponse>builder()
                .result(positionService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<PositionResponse>> getAllPositions(@RequestParam(required = false) String level) {
        return ApiResponse.<List<PositionResponse>>builder()
                .result(positionService.getAll(level))
                .build();
    }

    @GetMapping("/{positionId}")
    ApiResponse<PositionResponse> getPosition(@PathVariable String positionId) {
        return ApiResponse.<PositionResponse>builder()
                .result(positionService.getById(positionId))
                .build();
    }

    @PutMapping("/{positionId}")
    ApiResponse<PositionResponse> updatePosition(@PathVariable String positionId,
                                                 @RequestBody @Valid PositionRequest request) {
        return ApiResponse.<PositionResponse>builder()
                .result(positionService.update(positionId, request))
                .build();
    }

    @DeleteMapping("/{positionId}")
    ApiResponse<Void> deletePosition(@PathVariable String positionId) {
        positionService.delete(positionId);
        return ApiResponse.<Void>builder().build();
    }
}
