package com.operra.scheduling_and_attendance_service.attendance.method;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Value;
import lombok.experimental.FieldDefaults;

@Value
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceMethodContext {
    String employeeId;
    String branchId;
    String clientIp;
    String location;
    String qrCode;
    Double latitude;
    Double longitude;
}
