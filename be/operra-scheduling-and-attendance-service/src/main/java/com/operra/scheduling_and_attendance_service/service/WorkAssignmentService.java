package com.operra.scheduling_and_attendance_service.service;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.scheduling_and_attendance_service.dto.request.WorkAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.response.WorkAssignmentResponse;
import com.operra.scheduling_and_attendance_service.entity.WorkAssignment;
import com.operra.scheduling_and_attendance_service.mapper.WorkAssignmentMapper;
import com.operra.scheduling_and_attendance_service.repository.WorkAssignmentRepository;
import com.operra.scheduling_and_attendance_service.repository.ShiftAssignmentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WorkAssignmentService {
    WorkAssignmentRepository workAssignmentRepository;
    WorkAssignmentMapper workAssignmentMapper;
    ShiftAssignmentRepository shiftAssignmentRepository;

    public WorkAssignmentResponse create(WorkAssignmentRequest request) {
        var workAssignment = workAssignmentMapper.toWorkAssignment(request);
        workAssignment = workAssignmentRepository.save(workAssignment);
        return workAssignmentMapper.toWorkAssignmentResponse(workAssignment);
    }

    public List<WorkAssignmentResponse> getAll(String shiftType) {
        var workAssignments = shiftType == null || shiftType.isBlank()
                ? workAssignmentRepository.findAll()
                : workAssignmentRepository.findByShiftType(shiftType);

        return workAssignments.stream()
                .map(workAssignmentMapper::toWorkAssignmentResponse)
                .toList();
    }

    public WorkAssignmentResponse getById(String workAssignmentId) {
        return workAssignmentMapper.toWorkAssignmentResponse(findEntityById(workAssignmentId));
    }

    public WorkAssignmentResponse update(String workAssignmentId, WorkAssignmentRequest request) {
        var workAssignment = findEntityById(workAssignmentId);
        workAssignmentMapper.updateWorkAssignment(workAssignment, request);
        workAssignment = workAssignmentRepository.save(workAssignment);
        return workAssignmentMapper.toWorkAssignmentResponse(workAssignment);
    }

    public void delete(String workAssignmentId) {
        var workAssignment = findEntityById(workAssignmentId);
        if (shiftAssignmentRepository.existsByWorkAssignment(workAssignment)) {
            throw new AppException(ErrorCode.WORK_ASSIGNMENT_IN_USE);
        }
        workAssignmentRepository.delete(workAssignment);
    }

    public WorkAssignment findEntityById(String workAssignmentId) {
        return workAssignmentRepository.findById(workAssignmentId)
                .orElseThrow(() -> new AppException(ErrorCode.WORK_ASSIGNMENT_NOT_FOUND));
    }
}
