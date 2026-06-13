package com.operra.scheduling_and_attendance_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.scheduling_and_attendance_service.dto.request.WorkAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.response.WorkAssignmentResponse;
import com.operra.scheduling_and_attendance_service.service.WorkAssignmentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/work-assignments")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WorkAssignmentController {
    WorkAssignmentService workAssignmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_WORK_ASSIGNMENT')")
    ApiResponse<WorkAssignmentResponse> createWorkAssignment(@RequestBody @Valid WorkAssignmentRequest request) {
        return ApiResponse.<WorkAssignmentResponse>builder()
                .result(workAssignmentService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<WorkAssignmentResponse>> getAllWorkAssignments(@RequestParam(required = false) String shiftType) {
        return ApiResponse.<List<WorkAssignmentResponse>>builder()
                .result(workAssignmentService.getAll(shiftType))
                .build();
    }

    @GetMapping("/{workAssignmentId}")
    ApiResponse<WorkAssignmentResponse> getWorkAssignment(@PathVariable String workAssignmentId) {
        return ApiResponse.<WorkAssignmentResponse>builder()
                .result(workAssignmentService.getById(workAssignmentId))
                .build();
    }

    @PutMapping("/{workAssignmentId}")
    @PreAuthorize("hasAuthority('MANAGE_WORK_ASSIGNMENT')")
    ApiResponse<WorkAssignmentResponse> updateWorkAssignment(@PathVariable String workAssignmentId,
                                                             @RequestBody @Valid WorkAssignmentRequest request) {
        return ApiResponse.<WorkAssignmentResponse>builder()
                .result(workAssignmentService.update(workAssignmentId, request))
                .build();
    }

    @DeleteMapping("/{workAssignmentId}")
    @PreAuthorize("hasAuthority('MANAGE_WORK_ASSIGNMENT')")
    ApiResponse<Void> deleteWorkAssignment(@PathVariable String workAssignmentId) {
        workAssignmentService.delete(workAssignmentId);
        return ApiResponse.<Void>builder().build();
    }
}
