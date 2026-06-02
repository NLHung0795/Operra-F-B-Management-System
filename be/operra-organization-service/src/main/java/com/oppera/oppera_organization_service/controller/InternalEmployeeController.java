package com.oppera.oppera_organization_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.oppera.oppera_organization_service.dto.response.EmployeeResponse;
import com.oppera.oppera_organization_service.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/internal/employees")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InternalEmployeeController {
    EmployeeService employeeService;

    @GetMapping("/{employeeId}")
    ApiResponse<EmployeeResponse> getEmployee(@PathVariable String employeeId) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.getInternalById(employeeId))
                .build();
    }

    @GetMapping("/branch/{branchId}/count")
    ApiResponse<Long> countEmployeesByBranch(@PathVariable String branchId) {
        return ApiResponse.<Long>builder()
                .result(employeeService.countByBranch(branchId))
                .build();
    }
}
