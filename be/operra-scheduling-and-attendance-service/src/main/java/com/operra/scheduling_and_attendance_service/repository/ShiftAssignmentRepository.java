package com.operra.scheduling_and_attendance_service.repository;

import com.operra.scheduling_and_attendance_service.entity.ShiftAssignment;
import com.operra.scheduling_and_attendance_service.entity.WorkAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, String> {

    boolean existsShiftAssignmentByWorkAssignmentAndDate(WorkAssignment workAssignment, LocalDate date);

    boolean existsByWorkAssignmentAndDateAndEmployeeId(WorkAssignment workAssignment, LocalDate date, String employeeId);
}
