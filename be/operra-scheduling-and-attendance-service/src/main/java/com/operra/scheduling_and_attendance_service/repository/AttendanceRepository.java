package com.operra.scheduling_and_attendance_service.repository;

import com.operra.scheduling_and_attendance_service.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, String> {
}
