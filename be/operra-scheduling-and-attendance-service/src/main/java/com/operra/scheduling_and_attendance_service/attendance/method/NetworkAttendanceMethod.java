package com.operra.scheduling_and_attendance_service.attendance.method;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.scheduling_and_attendance_service.enums.AttendanceMethodType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class NetworkAttendanceMethod implements AttendanceMethod {
    @Override
    public AttendanceMethodType type() {
        return AttendanceMethodType.NETWORK;
    }

    @Override
    public void validate(AttendanceMethodContext context) {
        if (!StringUtils.hasText(context.getClientIp())) {
            throw new AppException(ErrorCode.INVALID_ATTENDANCE_LOCATION);
        }
    }

    @Override
    public String resolveLocation(AttendanceMethodContext context) {
        return context.getClientIp();
    }
}
