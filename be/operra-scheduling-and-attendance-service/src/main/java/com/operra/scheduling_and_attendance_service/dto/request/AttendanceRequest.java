package com.operra.scheduling_and_attendance_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceRequest {
    @NotBlank
    String employeeId;
    @NotBlank
    String shiftAssignmentId;
    String method;
    String location;
}
