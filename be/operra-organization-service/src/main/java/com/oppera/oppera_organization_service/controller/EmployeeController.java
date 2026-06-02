package com.oppera.oppera_organization_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.oppera.oppera_organization_service.dto.request.EmployeeRequest;
import com.oppera.oppera_organization_service.dto.request.EmployeeStatusUpdateRequest;
import com.oppera.oppera_organization_service.dto.request.EmployeeUpdateRequest;
import com.oppera.oppera_organization_service.dto.response.EmployeeResponse;
import com.oppera.oppera_organization_service.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeController {
    EmployeeService employeeService;

    @PostMapping
    ApiResponse<EmployeeResponse> createEmployee(@RequestBody @Valid EmployeeRequest request){
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.create(request))
                .build();
    }

    @GetMapping("/{employeeId}")
    ApiResponse<EmployeeResponse> getEmployee(@PathVariable String employeeId) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.getById(employeeId))
                .build();
    }

    @PutMapping("/{employeeId}")
    ApiResponse<EmployeeResponse> updateEmployee(@PathVariable String employeeId,
                                                 @RequestBody @Valid EmployeeUpdateRequest request) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.update(employeeId, request))
                .build();
    }

    @PutMapping("/{employeeId}/status")
    ApiResponse<EmployeeResponse> updateEmployeeStatus(@PathVariable String employeeId,
                                                       @RequestBody @Valid EmployeeStatusUpdateRequest request) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.updateStatus(employeeId, request.getStatus()))
                .build();
    }

    @GetMapping("/branch/{branchId}")
    ApiResponse<List<EmployeeResponse>> getEmployeesByBranch(@PathVariable String branchId) {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .result(employeeService.getByBranch(branchId))
                .build();
    }

    @GetMapping("/department/{departmentId}")
    ApiResponse<List<EmployeeResponse>> getEmployeesByDepartment(@PathVariable String departmentId) {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .result(employeeService.getByDepartment(departmentId))
                .build();
    }
}
