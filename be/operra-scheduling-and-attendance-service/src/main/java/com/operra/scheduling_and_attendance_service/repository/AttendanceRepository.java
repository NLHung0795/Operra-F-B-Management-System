package com.operra.scheduling_and_attendance_service.repository;

import com.operra.scheduling_and_attendance_service.entity.Attendance;
import com.operra.scheduling_and_attendance_service.entity.ShiftAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByEmployeeIdAndCheckInTimeBetweenOrderByCheckInTimeAsc(
            String employeeId,
            Instant from,
            Instant to
    );

    List<Attendance> findByEmployeeIdAndShiftAssignmentOrderByCheckInTimeDesc(String employeeId, ShiftAssignment shiftAssignment);

    Optional<Attendance> findFirstByEmployeeIdAndShiftAssignmentAndCheckOutTimeIsNullOrderByCheckInTimeDesc(
            String employeeId,
            ShiftAssignment shiftAssignment
    );

    List<Attendance> findByEmployeeIdAndShiftAssignment(String employeeId, ShiftAssignment shiftAssignment);
}
