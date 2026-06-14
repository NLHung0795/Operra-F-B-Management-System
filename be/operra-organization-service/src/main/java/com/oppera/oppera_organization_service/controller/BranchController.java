package com.oppera.oppera_organization_service.controller;

import com.oppera.oppera_organization_service.dto.request.BranchRequest;
import com.oppera.oppera_organization_service.dto.request.BranchStatusUpdateRequest;
import com.operra.operra_common.dto.response.BranchResponse;
import com.oppera.oppera_organization_service.service.BranchService;
import com.operra.operra_common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/branches")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BranchController {
    BranchService branchService;

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_BRANCH')")
    ApiResponse<BranchResponse> createBranch(@RequestParam String companyId,
                                             @RequestBody @Valid BranchRequest request) {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.create(companyId, request))
                .build();
    }

    @GetMapping
    ApiResponse<List<BranchResponse>> getBranches(
            @RequestParam(required = false) String companyId,
            @RequestParam(required = false) String status
    ) {
        if (companyId != null) {
            return ApiResponse.<List<BranchResponse>>builder()
                    .result(branchService.getByCompany(companyId))
                    .build();
        }

        if (status != null) {
            return ApiResponse.<List<BranchResponse>>builder()
                    .result(branchService.getByStatus(status))
                    .build();
        }

        return ApiResponse.<List<BranchResponse>>builder()
                .result(branchService.getAll())
                .build();
    }

    @GetMapping(path = "/{branchId}", params = "companyId")
    ApiResponse<BranchResponse> getBranch(@RequestParam String companyId,
                                          @PathVariable String branchId) {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.getById(companyId, branchId))
                .build();
    }

    @PutMapping(path = "/{branchId}", params = "companyId")
    @PreAuthorize("hasAuthority('MANAGE_BRANCH')")
    ApiResponse<BranchResponse> updateBranch(@RequestParam String companyId,
                                             @PathVariable String branchId,
                                             @RequestBody @Valid BranchRequest request) {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.update(companyId, branchId, request))
                .build();
    }

    @DeleteMapping(path = "/{branchId}", params = "companyId")
    @PreAuthorize("hasAuthority('MANAGE_BRANCH')")
    ApiResponse<Void> deleteBranch(@RequestParam String companyId,
                                   @PathVariable String branchId) {
        branchService.delete(companyId, branchId);
        return ApiResponse.<Void>builder().build();
    }

    @PutMapping("/{branchId}/status")
    @PreAuthorize("hasAuthority('MANAGE_BRANCH')")
    ApiResponse<BranchResponse> updateBranchStatus(@PathVariable String branchId,
                                                   @RequestBody @Valid BranchStatusUpdateRequest request) {
        return ApiResponse.<BranchResponse>builder()
                .result(branchService.updateStatus(branchId, request.getStatus()))
                .build();
    }
}
