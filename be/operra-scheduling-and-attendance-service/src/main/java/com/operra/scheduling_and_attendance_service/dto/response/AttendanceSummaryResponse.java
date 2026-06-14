package com.operra.scheduling_and_attendance_service.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceSummaryResponse {
    String employeeId;
    int month;
    int year;
    long totalMinutes;
    double totalHours;
    long attendanceCount;
}
