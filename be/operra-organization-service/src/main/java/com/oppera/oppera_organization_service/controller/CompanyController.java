package com.oppera.oppera_organization_service.controller;

import com.oppera.oppera_organization_service.dto.request.CompanyRequest;
import com.oppera.oppera_organization_service.dto.response.CompanyResponse;
import com.oppera.oppera_organization_service.service.CompanyService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/companies")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CompanyController {
    CompanyService companyService;

    @PostMapping
    ApiResponse<CompanyResponse> createCompany(@RequestBody @Valid CompanyRequest request) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<CompanyResponse>> getAllCompanies() {
        return ApiResponse.<List<CompanyResponse>>builder()
                .result(companyService.getAll())
                .build();
    }

    @GetMapping("/{companyId}")
    ApiResponse<CompanyResponse> getCompany(@PathVariable String companyId) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.getById(companyId))
                .build();
    }

    @PutMapping("/{companyId}")
    ApiResponse<CompanyResponse> updateCompany(@PathVariable String companyId,
                                               @RequestBody @Valid CompanyRequest request) {
        return ApiResponse.<CompanyResponse>builder()
                .result(companyService.update(companyId, request))
                .build();
    }

    @DeleteMapping("/{companyId}")
    ApiResponse<Void> deleteCompany(@PathVariable String companyId) {
        companyService.delete(companyId);
        return ApiResponse.<Void>builder().build();
    }
}
