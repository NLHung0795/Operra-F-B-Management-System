package com.operra.scheduling_and_attendance_service.mapper;

import com.operra.scheduling_and_attendance_service.dto.request.AttendanceRequest;
import com.operra.scheduling_and_attendance_service.dto.response.AttendanceResponse;
import com.operra.scheduling_and_attendance_service.entity.Attendance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {
    @Mapping(target = "shiftAssignment", ignore = true)
    @Mapping(target = "method", ignore = true)
    @Mapping(target = "checkInStatus", ignore = true)
    @Mapping(target = "checkOutStatus", ignore = true)
    Attendance toAttendance(AttendanceRequest request);

    @Mapping(target = "shiftAssignmentId", source = "shiftAssignment.id")
    AttendanceResponse toResponse(Attendance attendance);
}
