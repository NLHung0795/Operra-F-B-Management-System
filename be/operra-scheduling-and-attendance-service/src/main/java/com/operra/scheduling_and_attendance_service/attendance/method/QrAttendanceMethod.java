package com.operra.scheduling_and_attendance_service.attendance.method;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.scheduling_and_attendance_service.enums.AttendanceMethodType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class QrAttendanceMethod implements AttendanceMethod {
    @Override
    public AttendanceMethodType type() {
        return AttendanceMethodType.QR;
    }

    @Override
    public void validate(AttendanceMethodContext context) {
        if (!StringUtils.hasText(context.getQrCode())) {
            throw new AppException(ErrorCode.INVALID_ATTENDANCE_QR);
        }
    }

    @Override
    public String resolveLocation(AttendanceMethodContext context) {
        return context.getLocation();
    }
}
