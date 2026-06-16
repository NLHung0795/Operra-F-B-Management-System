package com.operra.scheduling_and_attendance_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.scheduling_and_attendance_service.dto.request.AttendanceRequest;
import com.operra.scheduling_and_attendance_service.dto.request.AttendanceStatusUpdateRequest;
import com.operra.scheduling_and_attendance_service.dto.response.AttendanceResponse;
import com.operra.scheduling_and_attendance_service.dto.response.AttendanceSummaryResponse;
import com.operra.scheduling_and_attendance_service.service.AttendanceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AttendanceController {
    AttendanceService attendanceService;

    @PostMapping("/check-in")
    @PreAuthorize("hasAuthority('ATTENDANCE_CHECK')")
    ApiResponse<AttendanceResponse> checkIn(@RequestBody @Valid AttendanceRequest request,
                                             HttpServletRequest httpServletRequest){

        String clientIp = getClientIp(httpServletRequest);
        return ApiResponse.<AttendanceResponse>builder()
                .result(attendanceService.checkIn(request, clientIp))
                .build();
    }

    @PutMapping("/check-out")
    @PreAuthorize("hasAuthority('ATTENDANCE_CHECK')")
    ApiResponse<AttendanceResponse> checkOut(@RequestBody @Valid AttendanceRequest request,
                                                      HttpServletRequest httpServletRequest){
        String clientIp = getClientIp(httpServletRequest);
        return ApiResponse.<AttendanceResponse>builder()
                .result(attendanceService.checkOut(request, clientIp))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('VIEW_ATTENDANCE') or hasAuthority('ATTENDANCE_CHECK')")
    ApiResponse<List<AttendanceResponse>> getAttendance(
            @RequestParam String employeeId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ApiResponse.<List<AttendanceResponse>>builder()
                .result(attendanceService.getByEmployeeAndMonth(employeeId, month, year))
                .build();
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('VIEW_ATTENDANCE') or hasAuthority('ATTENDANCE_CHECK')")
    ApiResponse<AttendanceSummaryResponse> getAttendanceSummary(
            @RequestParam String employeeId,
            @RequestParam int month,
            @RequestParam(required = false) Integer year
    ) {
        int resolvedYear = year != null ? year : Year.now().getValue();
        return ApiResponse.<AttendanceSummaryResponse>builder()
                .result(attendanceService.getSummary(employeeId, month, resolvedYear))
                .build();
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasAuthority('VIEW_ATTENDANCE') or hasAuthority('ATTENDANCE_CHECK')")
    ApiResponse<List<AttendanceResponse>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ApiResponse.<List<AttendanceResponse>>builder()
                .result(attendanceService.getByDate(date))
                .build();
    }

    @PutMapping("/{attendanceId}/status")
    @PreAuthorize("hasAuthority('MANAGE_ATTENDANCE')")
    ApiResponse<AttendanceResponse> updateAttendanceStatus(@PathVariable String attendanceId,
                                                           @RequestBody @Valid AttendanceStatusUpdateRequest request) {
        return ApiResponse.<AttendanceResponse>builder()
                .result(attendanceService.updateStatus(attendanceId, request))
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");

        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}
