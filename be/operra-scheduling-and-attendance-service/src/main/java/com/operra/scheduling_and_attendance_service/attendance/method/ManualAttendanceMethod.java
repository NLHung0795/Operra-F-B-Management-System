package com.operra.scheduling_and_attendance_service.attendance.method;

import com.operra.scheduling_and_attendance_service.enums.AttendanceMethodType;
import org.springframework.stereotype.Component;

@Component
public class ManualAttendanceMethod implements AttendanceMethod {
    @Override
    public AttendanceMethodType type() {
        return AttendanceMethodType.MANUAL;
    }

    @Override
    public void validate(AttendanceMethodContext context) {
    }

    @Override
    public String resolveLocation(AttendanceMethodContext context) {
        return context.getLocation();
    }
}
