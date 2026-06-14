package com.operra.scheduling_and_attendance_service.mapper;

import com.operra.scheduling_and_attendance_service.dto.request.ShiftAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.request.ShiftAssignmentUpdateRequest;
import com.operra.scheduling_and_attendance_service.dto.response.ShiftAssignmentResponse;
import com.operra.scheduling_and_attendance_service.entity.ShiftAssignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ShiftAssignmentMapper {
    @Mapping(target = "workAssignment", ignore = true)
    ShiftAssignment toShiftAssignment(ShiftAssignmentRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "workAssignment", ignore = true)
    void updateShiftAssignment(@MappingTarget ShiftAssignment shiftAssignment, ShiftAssignmentUpdateRequest request);

    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "assignedBy", ignore = true)
    ShiftAssignmentResponse toShiftAssignmentResponse(ShiftAssignment shiftAssignment);
}
