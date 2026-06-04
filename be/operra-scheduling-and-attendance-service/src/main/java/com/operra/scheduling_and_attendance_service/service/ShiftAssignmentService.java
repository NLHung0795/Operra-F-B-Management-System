package com.operra.scheduling_and_attendance_service.service;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.scheduling_and_attendance_service.dto.request.ShiftAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.response.ShiftAssignmentResponse;
import com.operra.scheduling_and_attendance_service.entity.WorkAssignment;
import com.operra.scheduling_and_attendance_service.mapper.ShiftAssignmentMapper;
import com.operra.scheduling_and_attendance_service.mapper.WorkAssignmentMapper;
import com.operra.scheduling_and_attendance_service.repository.ShiftAssignmentRepository;
import com.operra.scheduling_and_attendance_service.repository.WorkAssignmentRepository;
import com.operra.scheduling_and_attendance_service.repository.httpclient.EmployeeClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShiftAssignmentService {

    ShiftAssignmentRepository shiftAssignmentRepository;
    ShiftAssignmentMapper shiftAssignmentMapper;
    WorkAssignmentRepository workAssignmentRepository;
    WorkAssignmentMapper workAssignmentMapper;
    EmployeeClient employeeClient;

    public ShiftAssignmentResponse create(ShiftAssignmentRequest request){
        var employeeResponse = employeeClient.getEmployee(request.getEmployeeId());
        if (Objects.isNull(employeeResponse) || Objects.isNull(employeeResponse.getResult())) {
            throw new AppException(ErrorCode.EMPLOYEE_NOT_FOUND);
        }

        var assignerResponse = employeeClient.getEmployee(request.getAssignedBy());
        if (Objects.isNull(assignerResponse) || Objects.isNull(assignerResponse.getResult())) {
            throw new AppException(ErrorCode.EMPLOYEE_NOT_FOUND);
        }

        WorkAssignment workAssignment = workAssignmentRepository.findWorkAssignmentById(request.getWorkAssignmentId())
                .orElseThrow(() -> new AppException(ErrorCode.WORK_ASSIGNMENT_NOT_FOUND));

        if(shiftAssignmentRepository.existsByWorkAssignmentAndDateAndEmployeeId(workAssignment
                , request.getDate()
                , request.getEmployeeId())){
            throw new AppException(ErrorCode.SHIFT_ASSIGNMENT_EXISTED);
        }

        var shiftAssignment = shiftAssignmentMapper.toShiftAssignment(request);
        shiftAssignment.setWorkAssignment(workAssignment);

        shiftAssignment = shiftAssignmentRepository.save(shiftAssignment);

        var response = shiftAssignmentMapper.toShiftAssignmentResponse(shiftAssignment);
        response.setWorkAssignment(workAssignmentMapper.toWorkAssignmentResponse(workAssignment));
        response.setEmployee(employeeResponse.getResult());
        response.setAssignedBy(assignerResponse.getResult());
        return response;
    }
}
