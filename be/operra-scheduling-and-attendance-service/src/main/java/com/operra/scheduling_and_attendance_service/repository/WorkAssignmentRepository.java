package com.operra.scheduling_and_attendance_service.repository;

import com.operra.scheduling_and_attendance_service.entity.WorkAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkAssignmentRepository extends JpaRepository<WorkAssignment, String> {
    List<WorkAssignment> findByShiftType(String shiftType);

    Optional<WorkAssignment> findWorkAssignmentById(String id);
}
