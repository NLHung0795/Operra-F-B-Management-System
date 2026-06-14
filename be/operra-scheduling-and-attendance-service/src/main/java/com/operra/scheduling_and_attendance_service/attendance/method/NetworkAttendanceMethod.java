package com.operra.scheduling_and_attendance_service.attendance.method;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.scheduling_and_attendance_service.enums.AttendanceMethodType;
import com.operra.scheduling_and_attendance_service.repository.httpclient.BranchClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NetworkAttendanceMethod implements AttendanceMethod {
    BranchClient branchClient;

    @Override
    public AttendanceMethodType type() {
        return AttendanceMethodType.NETWORK;
    }

    @Override
    public boolean validate(AttendanceMethodContext context) {
        if (!StringUtils.hasText(context.getClientIp())
                || !StringUtils.hasText(context.getBranchId())) {
            throw new AppException(ErrorCode.INVALID_ATTENDANCE_LOCATION);
        }

        var response = branchClient.getBranch(context.getBranchId());
        var branch = response.getResult();

        if (branch == null || branch.getAllowedIpAddresses() == null) {
            throw new AppException(ErrorCode.INVALID_ATTENDANCE_LOCATION);
        }

        var clientIp = context.getClientIp().trim();

        boolean allowed = branch.getAllowedIpAddresses().stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .anyMatch(clientIp::equals);

        if (!allowed) {
            throw new AppException(ErrorCode.INVALID_ATTENDANCE_LOCATION);
        }

        return true;
    }

    @Override
    public String resolveLocation(AttendanceMethodContext context) {
        return context.getClientIp();
    }
}
