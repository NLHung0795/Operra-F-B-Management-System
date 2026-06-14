package com.operra.scheduling_and_attendance_service.dto.request;

import com.operra.scheduling_and_attendance_service.enums.AttendanceStatus;
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
public class AttendanceStatusUpdateRequest {
    AttendanceStatus checkInStatus;
    AttendanceStatus checkOutStatus;
}
