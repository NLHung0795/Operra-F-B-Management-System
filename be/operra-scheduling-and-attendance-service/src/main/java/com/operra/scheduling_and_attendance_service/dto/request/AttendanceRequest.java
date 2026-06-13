package com.operra.scheduling_and_attendance_service.dto.request;

import com.operra.scheduling_and_attendance_service.entity.ShiftAssignment;
import com.operra.scheduling_and_attendance_service.enums.AttendanceMethodType;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceRequest {
    String employeeId;
    String shiftAssignmentId;
    Instant checkInTime;
    Instant checkOutTime;
    String method;
    String location;
    String status;
}
