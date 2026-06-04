package com.operra.scheduling_and_attendance_service.mapper;

import com.operra.scheduling_and_attendance_service.dto.request.WorkAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.response.WorkAssignmentResponse;
import com.operra.scheduling_and_attendance_service.entity.WorkAssignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface WorkAssignmentMapper {
    WorkAssignment toWorkAssignment(WorkAssignmentRequest request);

    WorkAssignmentResponse toWorkAssignmentResponse(WorkAssignment workAssignment);

    @Mapping(target = "id", ignore = true)
    void updateWorkAssignment(@MappingTarget WorkAssignment workAssignment, WorkAssignmentRequest request);
}
