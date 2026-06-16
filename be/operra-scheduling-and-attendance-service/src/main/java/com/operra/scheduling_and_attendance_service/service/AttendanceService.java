package com.operra.scheduling_and_attendance_service.service;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.operra_common.dto.response.EmployeeResponse;
import com.operra.scheduling_and_attendance_service.attendance.method.AttendanceMethodContext;
import com.operra.scheduling_and_attendance_service.attendance.method.AttendanceMethodResolver;
import com.operra.scheduling_and_attendance_service.dto.request.AttendanceRequest;
import com.operra.scheduling_and_attendance_service.dto.request.AttendanceStatusUpdateRequest;
import com.operra.scheduling_and_attendance_service.dto.response.AttendanceResponse;
import com.operra.scheduling_and_attendance_service.dto.response.AttendanceSummaryResponse;
import com.operra.scheduling_and_attendance_service.entity.Attendance;
import com.operra.scheduling_and_attendance_service.entity.WorkAssignment;
import com.operra.scheduling_and_attendance_service.enums.AttendanceMethodType;
import com.operra.scheduling_and_attendance_service.enums.AttendanceStatus;
import com.operra.scheduling_and_attendance_service.mapper.AttendanceMapper;
import com.operra.scheduling_and_attendance_service.repository.AttendanceRepository;
import com.operra.scheduling_and_attendance_service.repository.ShiftAssignmentRepository;
import com.operra.scheduling_and_attendance_service.repository.WorkAssignmentRepository;
import com.operra.scheduling_and_attendance_service.repository.httpclient.EmployeeClient;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AttendanceService {
    AttendanceRepository attendanceRepository;
    AttendanceMethodResolver attendanceMethodResolver;
    AttendanceMapper attendanceMapper;
    ShiftAssignmentRepository shiftAssignmentRepository;
    WorkAssignmentRepository workAssignmentRepository;
    EmployeeClient employeeClient;

    @NonFinal
    @Value("${app.attendance.type}")
    String attendanceType;

    @Transactional
    public AttendanceResponse checkIn(AttendanceRequest request, String ipAddress) {
        var methodType = AttendanceMethodType.valueOf(attendanceType.trim().toUpperCase());

        var employee = getEmployeeByEmployeeOrUserAccountId(request.getEmployeeId());

        var shiftAssignment = shiftAssignmentRepository.findById(request.getShiftAssignmentId())
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_ASSIGNMENT_NOT_FOUND));

        if (!shiftAssignment.getEmployeeId().equals(employee.getId())) {
            throw new AppException(ErrorCode.INVALID_ATTENDANCE_EMPLOYEE);
        }

        attendanceRepository
                .findByEmployeeIdAndShiftAssignment(employee.getId(), shiftAssignment)
                .stream()
                .filter(a -> a.getCheckOutTime() != null) // đã hoàn thành
                .findAny()
                .ifPresent(a -> { throw new AppException(ErrorCode.SHIFT_ALREADY_COMPLETED); });

        attendanceRepository
                .findFirstByEmployeeIdAndShiftAssignmentAndCheckOutTimeIsNullOrderByCheckInTimeDesc(
                        employee.getId(),
                        shiftAssignment
                )
                .ifPresent(attendance -> {
                    throw new AppException(ErrorCode.ATTENDANCE_ALREADY_CHECKED_IN);
                });

        var context = AttendanceMethodContext.builder()
                .clientIp(ipAddress)
                .branchId(employee.getBranchId())
                .employeeId(employee.getId())
                .build();

        attendanceMethodResolver.resolve(methodType).validate(context);

        var attendance = attendanceMapper.toAttendance(request);
        attendance.setEmployeeId(employee.getId()); // ensure real Employee ID is stored, not User Account ID
        attendance.setShiftAssignment(shiftAssignment);
        attendance.setMethod(methodType);
        attendance.setCheckInTime(Instant.now());

        var workAssignment = shiftAssignment.getWorkAssignment();
        var checkInTime = attendance.getCheckInTime().atZone(ZoneId.systemDefault()).toLocalTime();

        if (checkInTime.isAfter(workAssignment.getStartTime())) {
            attendance.setCheckInStatus(AttendanceStatus.CHECK_IN_LATE);
        } else {
            attendance.setCheckInStatus(AttendanceStatus.CHECK_IN_ON_TIME);
        }


        return toResponse(attendanceRepository.save(attendance));
    }

    @Transactional
    public AttendanceResponse checkOut(AttendanceRequest request, String ipAddress){
        var methodType = AttendanceMethodType.valueOf(attendanceType.trim().toUpperCase());

        var employee = getEmployeeByEmployeeOrUserAccountId(request.getEmployeeId());

        var shiftAssignment = shiftAssignmentRepository.findById(request.getShiftAssignmentId())
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_ASSIGNMENT_NOT_FOUND));

        if (!shiftAssignment.getEmployeeId().equals(employee.getId())) {
            throw new AppException(ErrorCode.INVALID_ATTENDANCE_EMPLOYEE);
        }

        var context = AttendanceMethodContext.builder()
                .clientIp(ipAddress)
                .branchId(employee.getBranchId())
                .employeeId(employee.getId())
                .build();

        attendanceMethodResolver.resolve(methodType).validate(context);

        var attendance = attendanceRepository
                .findFirstByEmployeeIdAndShiftAssignmentAndCheckOutTimeIsNullOrderByCheckInTimeDesc
                        (
                                employee.getId(),
                                shiftAssignment
                        )
                .orElseThrow(() -> new AppException(ErrorCode.ATTENDANCE_NOT_FOUND));

        attendance.setCheckOutTime(Instant.now());
        var workAssignment = shiftAssignment.getWorkAssignment();
        var checkOutTime = attendance.getCheckOutTime().atZone(ZoneId.systemDefault()).toLocalTime();

        if (checkOutTime.isBefore(workAssignment.getEndTime())) {
            attendance.setCheckOutStatus(AttendanceStatus.CHECK_OUT_SOON);
        } else {
            attendance.setCheckOutStatus(AttendanceStatus.CHECK_OUT_ON_TIME);
        }

        return toResponse(attendanceRepository.save(attendance));

    }

    public List<AttendanceResponse> getByEmployeeAndMonth(String employeeId, int month, int year) {
        var range = monthRange(month, year);

        return attendanceRepository
                .findByEmployeeIdAndCheckInTimeBetweenOrderByCheckInTimeAsc(employeeId, range.from(), range.to())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AttendanceResponse> getByDate(LocalDate date) {
        var range = dayRange(date);

        return attendanceRepository
                .findByCheckInTimeBetweenOrderByCheckInTimeAsc(range.from(), range.to())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AttendanceSummaryResponse getSummary(String employeeId, int month, int year) {
        var attendances = getByEmployeeAndMonth(employeeId, month, year);
        long totalMinutes = attendances.stream()
                .map(AttendanceResponse::getWorkedMinutes)
                .filter(minutes -> minutes != null && minutes > 0)
                .mapToLong(Long::longValue)
                .sum();

        return AttendanceSummaryResponse.builder()
                .employeeId(employeeId)
                .month(month)
                .year(year)
                .totalMinutes(totalMinutes)
                .totalHours(totalMinutes / 60.0)
                .attendanceCount(attendances.size())
                .build();
    }

    public AttendanceResponse updateStatus(String attendanceId, AttendanceStatusUpdateRequest request) {
        var attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new AppException(ErrorCode.ATTENDANCE_NOT_FOUND));

        if (request.getCheckInStatus() != null) {
            attendance.setCheckInStatus(request.getCheckInStatus());
        }
        if (request.getCheckOutStatus() != null) {
            attendance.setCheckOutStatus(request.getCheckOutStatus());
        }
        return toResponse(attendanceRepository.save(attendance));
    }

    private AttendanceResponse toResponse(Attendance attendance) {
        WorkAssignment workAssignment = attendance.getShiftAssignment().getWorkAssignment();
        var checkInTime = attendance.getCheckInTime().atZone(ZoneId.systemDefault()).toLocalTime();
        var workAssignmentTime = workAssignment.getStartTime();

        var attendanceResponse = attendanceMapper.toResponse(attendance);
        attendanceResponse.setSuccess(true);
        attendanceResponse.setWorkedMinutes(calculateWorkedMinutes(attendance.getCheckInTime(), attendance.getCheckOutTime()));
        attendanceResponse.setLateMinutes(workAssignmentTime.isBefore(checkInTime)
                ? Duration.between(workAssignmentTime, checkInTime).toMinutes()
                : 0);
        return attendanceResponse;
    }

    private Long calculateWorkedMinutes(Instant checkInTime, Instant checkOutTime) {
        if (checkInTime == null || checkOutTime == null || checkOutTime.isBefore(checkInTime)) {
            return 0L;
        }
        return Duration.between(checkInTime, checkOutTime).toMinutes();
    }

    private MonthRange monthRange(int month, int year) {
        var yearMonth = YearMonth.of(year, month);
        var zoneId = ZoneId.systemDefault();
        Instant from = yearMonth.atDay(1).atStartOfDay(zoneId).toInstant();
        Instant to = yearMonth.plusMonths(1).atDay(1).atStartOfDay(zoneId).toInstant().minusMillis(1);
        return new MonthRange(from, to);
    }

    private MonthRange dayRange(LocalDate date) {
        var zoneId = ZoneId.systemDefault();
        Instant from = date.atStartOfDay(zoneId).toInstant();
        Instant to = date.plusDays(1).atStartOfDay(zoneId).toInstant().minusMillis(1);
        return new MonthRange(from, to);
    }

    private record MonthRange(Instant from, Instant to) {
    }

    private EmployeeResponse getEmployeeByEmployeeOrUserAccountId(String id) {
        try {
            var response = employeeClient.getEmployee(id);
            if (response != null && response.getResult() != null) {
                return response.getResult();
            }
        } catch (FeignException exception) {
            var response = employeeClient.getEmployeeByUserAccountId(id);
            if (response != null && response.getResult() != null) {
                return response.getResult();
            }
        }
        throw new AppException(ErrorCode.EMPLOYEE_NOT_FOUND);
    }
}
