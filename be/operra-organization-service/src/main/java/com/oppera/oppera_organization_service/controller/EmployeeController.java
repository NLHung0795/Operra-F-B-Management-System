package com.oppera.oppera_organization_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.dto.PageResponse;
import com.oppera.oppera_organization_service.dto.request.EmployeeRequest;
import com.oppera.oppera_organization_service.dto.request.EmployeeStatusUpdateRequest;
import com.oppera.oppera_organization_service.dto.request.EmployeeUpdateRequest;
import com.operra.operra_common.dto.response.EmployeeResponse;
import com.oppera.oppera_organization_service.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeController {
    EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_EMPLOYEE')")
    ApiResponse<EmployeeResponse> createEmployee(@RequestBody @Valid EmployeeRequest request){
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.create(request))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_EMPLOYEE')")
    ApiResponse<PageResponse<EmployeeResponse>> getAllEmployees(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "20") int size){
        return ApiResponse.<PageResponse<EmployeeResponse>>builder()
                .result(employeeService.getAll(page, size))
                .build();
    }

    @GetMapping("/me")
    ApiResponse<EmployeeResponse> getMyProfile() {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.getMyProfile())
                .build();
    }

    @GetMapping("/{employeeId}")
    @PreAuthorize("hasAuthority('VIEW_EMPLOYEE')")
    ApiResponse<EmployeeResponse> getEmployee(@PathVariable String employeeId) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.getById(employeeId))
                .build();
    }

    @PutMapping("/{employeeId}")
    @PreAuthorize("hasAuthority('MANAGE_EMPLOYEE')")
    ApiResponse<EmployeeResponse> updateEmployee(@PathVariable String employeeId,
                                                 @RequestBody @Valid EmployeeUpdateRequest request) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.update(employeeId, request))
                .build();
    }

    @PutMapping("/{employeeId}/status")
    @PreAuthorize("hasAuthority('MANAGE_EMPLOYEE')")
    ApiResponse<EmployeeResponse> updateEmployeeStatus(@PathVariable String employeeId,
                                                       @RequestBody @Valid EmployeeStatusUpdateRequest request) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.updateStatus(employeeId, request.getStatus()))
                .build();
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAuthority('VIEW_EMPLOYEE')")
    ApiResponse<List<EmployeeResponse>> getEmployeesByBranch(@PathVariable String branchId) {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .result(employeeService.getByBranch(branchId))
                .build();
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAuthority('VIEW_EMPLOYEE')")
    ApiResponse<List<EmployeeResponse>> getEmployeesByDepartment(@PathVariable String departmentId) {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .result(employeeService.getByDepartment(departmentId))
                .build();
    }
}
