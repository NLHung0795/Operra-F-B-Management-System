package com.oppera.oppera_organization_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.dto.response.BranchResponse;
import com.oppera.oppera_organization_service.service.BranchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/branches")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalBranchController {
    BranchService branchService;

    @GetMapping("/{branchId}")
    ApiResponse<BranchResponse> getBranch(@PathVariable String branchId) {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.getInternalById(branchId))
                .build();
    }
}
