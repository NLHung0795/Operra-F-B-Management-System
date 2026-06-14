package com.operra.scheduling_and_attendance_service.service;

import com.operra.operra_common.dto.response.EmployeeResponse;
import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.scheduling_and_attendance_service.dto.request.BulkShiftAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.request.ShiftAssignmentRequest;
import com.operra.scheduling_and_attendance_service.dto.request.ShiftAssignmentUpdateRequest;
import com.operra.scheduling_and_attendance_service.dto.response.ShiftAssignmentResponse;
import com.operra.scheduling_and_attendance_service.entity.ShiftAssignment;
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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

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

        if(!employeeResponse.getResult().getStatus().equals("ACTIVE")){
            throw new AppException(ErrorCode.EMPLOYEE_NOT_ACTIVE);
        }

        if (request.getDate().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.INVALID_SHIFT_DATE);
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

    @Transactional
    public List<ShiftAssignmentResponse> createBulk(BulkShiftAssignmentRequest request) {
        return request.getAssignments().stream()
                .map(item -> ShiftAssignmentRequest.builder()
                        .employeeId(item.getEmployeeId())
                        .workAssignmentId(item.getWorkAssignmentId())
                        .assignedBy(request.getAssignedBy())
                        .date(item.getDate())
                        .build())
                .map(this::create)
                .toList();
    }

    public List<ShiftAssignmentResponse> getByEmployeeAndDateRange(String employeeId, LocalDate fromDate, LocalDate toDate) {
        var employee = getEmployeeById(employeeId, ErrorCode.EMPLOYEE_NOT_FOUND);
        return shiftAssignmentRepository.findByEmployeeIdAndDateBetween(employeeId, fromDate, toDate).stream()
                .map(shiftAssignment -> toResponse(shiftAssignment, employee, null))
                .toList();
    }

    public List<ShiftAssignmentResponse> getByBranchAndDate(String branchId, LocalDate date) {
        var employeeResponse = employeeClient.getEmployeesByBranch(branchId);
        if (Objects.isNull(employeeResponse) || Objects.isNull(employeeResponse.getResult())) {
            throw new AppException(ErrorCode.BRANCH_NOT_FOUND);
        }

        var employeesById = employeeResponse.getResult().stream()
                .collect(Collectors.toMap(EmployeeResponse::getId, Function.identity()));

        if (employeesById.isEmpty()) {
            return List.of();
        }

        return shiftAssignmentRepository.findByDateAndEmployeeIdIn(date, employeesById.keySet()).stream()
                .map(shiftAssignment -> toResponse(
                        shiftAssignment,
                        employeesById.get(shiftAssignment.getEmployeeId()),
                        null))
                .toList();
    }

    public ShiftAssignmentResponse update(String shiftAssignmentId, ShiftAssignmentUpdateRequest request) {
        var shiftAssignment = findShiftAssignmentById(shiftAssignmentId);
        var employee = getActiveEmployee(request.getEmployeeId());
        var assigner = getEmployeeById(request.getAssignedBy(), ErrorCode.ASSIGNER_NOT_FOUND);
        var workAssignment = getWorkAssignmentById(request.getWorkAssignmentId());

        validateDuplicateShift(workAssignment, request.getDate(), request.getEmployeeId(), shiftAssignmentId);

        shiftAssignmentMapper.updateShiftAssignment(shiftAssignment, request);
        shiftAssignment.setWorkAssignment(workAssignment);
        shiftAssignment = shiftAssignmentRepository.save(shiftAssignment);

        return toResponse(shiftAssignment, employee, assigner);
    }

    public void delete(String shiftAssignmentId) {
        shiftAssignmentRepository.delete(findShiftAssignmentById(shiftAssignmentId));
    }

    private ShiftAssignment findShiftAssignmentById(String shiftAssignmentId) {
        return shiftAssignmentRepository.findById(shiftAssignmentId)
                .orElseThrow(() -> new AppException(ErrorCode.SHIFT_ASSIGNMENT_NOT_FOUND));
    }

    private WorkAssignment getWorkAssignmentById(String workAssignmentId) {
        return workAssignmentRepository.findWorkAssignmentById(workAssignmentId)
                .orElseThrow(() -> new AppException(ErrorCode.WORK_ASSIGNMENT_NOT_FOUND));
    }

    private EmployeeResponse getActiveEmployee(String employeeId) {
        var employee = getEmployeeById(employeeId, ErrorCode.EMPLOYEE_NOT_FOUND);
        if (!"ACTIVE".equals(employee.getStatus())) {
            throw new AppException(ErrorCode.EMPLOYEE_NOT_ACTIVE);
        }
        return employee;
    }

    private EmployeeResponse getEmployeeById(String employeeId, ErrorCode errorCode) {
        var employeeResponse = employeeClient.getEmployee(employeeId);
        if (Objects.isNull(employeeResponse) || Objects.isNull(employeeResponse.getResult())) {
            throw new AppException(errorCode);
        }
        return employeeResponse.getResult();
    }

    private void validateDuplicateShift(
            WorkAssignment workAssignment,
            LocalDate date,
            String employeeId,
            String currentShiftAssignmentId
    ) {
        boolean existed = Objects.isNull(currentShiftAssignmentId)
                ? shiftAssignmentRepository.existsByWorkAssignmentAndDateAndEmployeeId(workAssignment, date, employeeId)
                : shiftAssignmentRepository.existsByWorkAssignmentAndDateAndEmployeeIdAndIdNot(
                        workAssignment,
                        date,
                        employeeId,
                        currentShiftAssignmentId
                );

        if (existed) {
            throw new AppException(ErrorCode.SHIFT_ASSIGNMENT_EXISTED);
        }
    }

    private ShiftAssignmentResponse toResponse(
            ShiftAssignment shiftAssignment,
            EmployeeResponse employee,
            EmployeeResponse assigner
    ) {
        var response = shiftAssignmentMapper.toShiftAssignmentResponse(shiftAssignment);
        response.setWorkAssignment(workAssignmentMapper.toWorkAssignmentResponse(shiftAssignment.getWorkAssignment()));
        response.setEmployee(Objects.nonNull(employee)
                ? employee
                : getEmployeeById(shiftAssignment.getEmployeeId(), ErrorCode.EMPLOYEE_NOT_FOUND));
        response.setAssignedBy(Objects.nonNull(assigner)
                ? assigner
                : getEmployeeById(shiftAssignment.getAssignedBy(), ErrorCode.ASSIGNER_NOT_FOUND));
        return response;
    }
}
