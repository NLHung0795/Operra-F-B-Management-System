package com.operra.scheduling_and_attendance_service.attendance.method;

import com.operra.scheduling_and_attendance_service.enums.AttendanceMethodType;

public interface AttendanceMethod {
    AttendanceMethodType type();

    void validate(AttendanceMethodContext context);

    String resolveLocation(AttendanceMethodContext context);
}
