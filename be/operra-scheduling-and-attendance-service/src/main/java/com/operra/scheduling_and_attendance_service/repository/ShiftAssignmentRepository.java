package com.operra.scheduling_and_attendance_service.repository;

import com.operra.scheduling_and_attendance_service.entity.ShiftAssignment;
import com.operra.scheduling_and_attendance_service.entity.WorkAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, String> {

    boolean existsShiftAssignmentByWorkAssignmentAndDate(WorkAssignment workAssignment, LocalDate date);

    boolean existsByWorkAssignmentAndDateAndEmployeeId(WorkAssignment workAssignment, LocalDate date, String employeeId);

    boolean existsByWorkAssignmentAndDateAndEmployeeIdAndIdNot(
            WorkAssignment workAssignment,
            LocalDate date,
            String employeeId,
            String id
    );

    List<ShiftAssignment> findByEmployeeIdAndDateBetween(String employeeId, LocalDate fromDate, LocalDate toDate);

    List<ShiftAssignment> findByDateAndEmployeeIdIn(LocalDate date, Collection<String> employeeIds);
}
