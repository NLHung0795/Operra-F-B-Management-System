package com.operra.scheduling_and_attendance_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.scheduling_and_attendance_service.dto.request.BulkShiftAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.request.ShiftAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.request.ShiftAssignmentUpdateRequest;
import com.operra.scheduling_and_attendance_service.dto.response.ShiftAssignmentResponse;
import com.operra.scheduling_and_attendance_service.service.ShiftAssignmentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/shift-assignments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShiftAssignmentController {
    ShiftAssignmentService shiftAssignmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_SHIFT_ASSIGNMENT')")
    ApiResponse<ShiftAssignmentResponse> createShiftAssignment(@RequestBody @Valid ShiftAssignmentRequest request){
        return ApiResponse.<ShiftAssignmentResponse>builder()
                .result(shiftAssignmentService.create(request))
                .build();
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority('MANAGE_SHIFT_ASSIGNMENT')")
    ApiResponse<List<ShiftAssignmentResponse>> createBulkShiftAssignments(
            @RequestBody @Valid BulkShiftAssignmentRequest request
    ){
        return ApiResponse.<List<ShiftAssignmentResponse>>builder()
                .result(shiftAssignmentService.createBulk(request))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_SHIFT_ASSIGNMENT')")
    ApiResponse<List<ShiftAssignmentResponse>> getShiftAssignments(
            @RequestParam String employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ApiResponse.<List<ShiftAssignmentResponse>>builder()
                .result(shiftAssignmentService.getByEmployeeAndDateRange(employeeId, fromDate, toDate))
                .build();
    }

    @GetMapping("/branch/{branchId}/date/{date}")
    @PreAuthorize("hasAuthority('VIEW_SHIFT_ASSIGNMENT')")
    ApiResponse<List<ShiftAssignmentResponse>> getShiftAssignmentsByBranchAndDate(
            @PathVariable String branchId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ApiResponse.<List<ShiftAssignmentResponse>>builder()
                .result(shiftAssignmentService.getByBranchAndDate(branchId, date))
                .build();
    }

    @PutMapping("/{shiftAssignmentId}")
    @PreAuthorize("hasAuthority('MANAGE_SHIFT_ASSIGNMENT')")
    ApiResponse<ShiftAssignmentResponse> updateShiftAssignment(
            @PathVariable String shiftAssignmentId,
            @RequestBody @Valid ShiftAssignmentUpdateRequest request
    ) {
        return ApiResponse.<ShiftAssignmentResponse>builder()
                .result(shiftAssignmentService.update(shiftAssignmentId, request))
                .build();
    }

    @DeleteMapping("/{shiftAssignmentId}")
    @PreAuthorize("hasAuthority('MANAGE_SHIFT_ASSIGNMENT')")
    ApiResponse<Void> deleteShiftAssignment(@PathVariable String shiftAssignmentId) {
        shiftAssignmentService.delete(shiftAssignmentId);
        return ApiResponse.<Void>builder().build();
    }
}
