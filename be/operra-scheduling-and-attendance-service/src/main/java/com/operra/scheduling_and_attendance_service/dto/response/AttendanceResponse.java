package com.operra.scheduling_and_attendance_service.dto.response;

import com.operra.scheduling_and_attendance_service.enums.AttendanceStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceResponse {
    boolean success;
    String id;
    String employeeId;
    String shiftAssignmentId;
    Instant checkInTime;
    Instant checkOutTime;
    String method;
    String location;
    AttendanceStatus checkInStatus;
    AttendanceStatus checkOutStatus;
    Long workedMinutes;
}
