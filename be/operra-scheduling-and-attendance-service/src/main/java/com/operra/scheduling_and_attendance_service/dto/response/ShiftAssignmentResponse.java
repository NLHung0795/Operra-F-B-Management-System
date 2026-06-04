package com.operra.scheduling_and_attendance_service.dto.response;

import com.operra.operra_common.dto.response.EmployeeResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftAssignmentResponse {
    EmployeeResponse employee;
    WorkAssignmentResponse workAssignment;
    EmployeeResponse assignedBy;
    LocalDate date;
}
