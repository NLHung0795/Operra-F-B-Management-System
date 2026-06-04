package com.operra.scheduling_and_attendance_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.scheduling_and_attendance_service.dto.request.BulkShiftAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.request.ShiftAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.response.ShiftAssignmentResponse;
import com.operra.scheduling_and_attendance_service.service.ShiftAssignmentService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/shift-assignments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShiftAssignmentController {
    ShiftAssignmentService shiftAssignmentService;

    @PostMapping
    ApiResponse<ShiftAssignmentResponse> createShiftAssignment(@RequestBody @Valid ShiftAssignmentRequest request){
        return ApiResponse.<ShiftAssignmentResponse>builder()
                .result(shiftAssignmentService.create(request))
                .build();
    }

    @PostMapping("/bulk")
    ApiResponse<List<ShiftAssignmentResponse>> createBulkShiftAssignments(
            @RequestBody @Valid BulkShiftAssignmentRequest request
    ){
        return ApiResponse.<List<ShiftAssignmentResponse>>builder()
                .result(shiftAssignmentService.createBulk(request))
                .build();
    }
}
