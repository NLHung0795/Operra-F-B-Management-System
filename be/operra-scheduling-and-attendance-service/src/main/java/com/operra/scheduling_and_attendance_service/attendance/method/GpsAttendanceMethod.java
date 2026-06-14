package com.operra.scheduling_and_attendance_service.attendance.method;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.scheduling_and_attendance_service.enums.AttendanceMethodType;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class GpsAttendanceMethod implements AttendanceMethod {
    @Override
    public AttendanceMethodType type() {
        return AttendanceMethodType.GPS;
    }

    @Override
    public boolean validate(AttendanceMethodContext context) {
        if (Objects.isNull(context.getLatitude()) || Objects.isNull(context.getLongitude())) {
            throw new AppException(ErrorCode.INVALID_ATTENDANCE_LOCATION);
        }
        return true;
    }

    @Override
    public String resolveLocation(AttendanceMethodContext context) {
        return context.getLatitude() + "," + context.getLongitude();
    }
}
