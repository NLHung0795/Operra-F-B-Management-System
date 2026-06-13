package com.operra.scheduling_and_attendance_service.attendance.method;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.scheduling_and_attendance_service.enums.AttendanceMethodType;
import org.springframework.stereotype.Component;

    
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class AttendanceMethodResolver {
    private final Map<AttendanceMethodType, AttendanceMethod> methods;

    public AttendanceMethodResolver(List<AttendanceMethod> methods) {
        this.methods = methods.stream()
                .collect(Collectors.toMap(
                        AttendanceMethod::type,
                        Function.identity(),
                        (first, second) -> first,
                        () -> new EnumMap<>(AttendanceMethodType.class)));
    }

    public AttendanceMethod resolve(AttendanceMethodType type) {
        var method = methods.get(type);
        if (method == null) {
            throw new AppException(ErrorCode.INVALID_ATTENDANCE_METHOD);
        }
        return method;
    }
}
