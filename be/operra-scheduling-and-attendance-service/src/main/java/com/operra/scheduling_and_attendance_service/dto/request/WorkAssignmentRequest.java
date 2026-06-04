package com.operra.scheduling_and_attendance_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WorkAssignmentRequest {
    @NotBlank
    String name;

    @NotNull
    LocalTime startTime;

    @NotNull
    LocalTime endTime;

    Integer breakTime;

    @NotBlank
    String shiftType;
}
