package com.operra.scheduling_and_attendance_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftAssignmentRequest {
    @NotBlank
    String employeeId;

    @NotBlank
    String workAssignmentId;

    @NotBlank
    String assignedBy;

    @NotNull
    LocalDate date;
}
