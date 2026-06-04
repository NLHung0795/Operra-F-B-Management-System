package com.operra.scheduling_and_attendance_service.dto.response;

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
public class WorkAssignmentResponse {
    String id;
    String name;
    LocalTime startTime;
    LocalTime endTime;
    Integer breakTime;
    String shiftType;
}
