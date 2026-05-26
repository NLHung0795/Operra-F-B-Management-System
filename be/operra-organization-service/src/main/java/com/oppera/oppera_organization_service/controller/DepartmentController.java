package com.oppera.oppera_organization_service.controller;

import com.oppera.oppera_organization_service.dto.request.DepartmentRequest;
import com.oppera.oppera_organization_service.dto.response.DepartmentResponse;
import com.oppera.oppera_organization_service.service.DepartmentService;
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
@RequestMapping("/departments")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentController {
    DepartmentService departmentService;

    @PostMapping
    ApiResponse<DepartmentResponse> createDepartment(@RequestBody @Valid DepartmentRequest request) {
        return ApiResponse.<DepartmentResponse>builder()
                .result(departmentService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<DepartmentResponse>> getAllDepartments() {
        return ApiResponse.<List<DepartmentResponse>>builder()
                .result(departmentService.getAll())
                .build();
    }

    @GetMapping("/{departmentId}")
    ApiResponse<DepartmentResponse> getDepartment(@PathVariable String departmentId) {
        return ApiResponse.<DepartmentResponse>builder()
                .result(departmentService.getById(departmentId))
                .build();
    }

    @PutMapping("/{departmentId}")
    ApiResponse<DepartmentResponse> updateDepartment(@PathVariable String departmentId,
                                                     @RequestBody @Valid DepartmentRequest request) {
        return ApiResponse.<DepartmentResponse>builder()
                .result(departmentService.update(departmentId, request))
                .build();
    }

    @DeleteMapping("/{departmentId}")
    ApiResponse<Void> deleteDepartment(@PathVariable String departmentId) {
        departmentService.delete(departmentId);
        return ApiResponse.<Void>builder().build();
    }
}
