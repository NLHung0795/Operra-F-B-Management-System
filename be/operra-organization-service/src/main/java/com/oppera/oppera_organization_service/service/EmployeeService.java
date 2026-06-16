package com.oppera.oppera_organization_service.service;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.operra_common.dto.PageResponse;
import com.oppera.oppera_organization_service.dto.request.EmployeeRequest;
import com.oppera.oppera_organization_service.dto.request.EmployeeUpdateRequest;
import com.operra.operra_common.dto.response.EmployeeResponse;
import com.oppera.oppera_organization_service.entity.Department;
import com.oppera.oppera_organization_service.entity.Position;
import com.oppera.oppera_organization_service.mapper.EmployeeMapper;
import com.oppera.oppera_organization_service.mapper.UserAccountMapper;
import com.oppera.oppera_organization_service.repository.BranchRepository;
import com.oppera.oppera_organization_service.repository.DepartmentRepository;
import com.oppera.oppera_organization_service.repository.EmployeeRepository;
import com.oppera.oppera_organization_service.repository.PositionRepository;
import com.oppera.oppera_organization_service.repository.httpclient.UserAccountClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeService {
    EmployeeRepository employeeRepository;
    BranchRepository branchRepository;
    DepartmentRepository departmentRepository;
    PositionRepository positionRepository;
    UserAccountClient userAccountClient;
    EmployeeMapper employeeMapper;
    UserAccountMapper userAccountMapper;
    KafkaTemplate<String, Object> kafkaTemplate;

    public EmployeeResponse create(EmployeeRequest request){
        var employee = employeeMapper.toEmployee(request);

        var branch = findBranchById(request.getBranchId());
        var department = findDepartmentByName(request.getDepartmentName());
        var position = findPositionByName(request.getPositionName());

        employee.setBranch(branch);
        employee.setDepartment(department);
        employee.setPosition(position);

        var userAccountRequest = userAccountMapper.toUserAccountCreationRequest(request);
        var userAccountResponse = userAccountClient.createUserAccount(userAccountRequest).getResult();

        if(Objects.isNull(userAccountResponse))
            throw new AppException(ErrorCode.USER_ACCOUNT_ERROR);

        employee.setUserAccountId(userAccountResponse.getId());
        employee = employeeRepository.save(employee);

//        EmployeeEvent employeeEvent = EmployeeEvent.builder()
//                .employeeId(employee.getId())
//                .eventId(UUID.randomUUID().toString())
//                .branchId(branch.getId())
//                .departmentId(department.getId())
//                .eventType("employee.created")
//                .positionId(position.getId())
//                .occurredAt(Instant.now())
//                .build();
//
//        kafkaTemplate.send("employee-create-delivery", employeeEvent);

        return employeeMapper.toEmployeeResponse(employee);
    }

    public EmployeeResponse getById(String employeeId) {
        return employeeMapper.toEmployeeResponse(findEmployeeById(employeeId));
    }

    public EmployeeResponse getInternalById(String employeeId) {
        return getById(employeeId);
    }

    public EmployeeResponse getInternalByUserAccountId(String userAccountId) {
        return employeeMapper.toEmployeeResponse(employeeRepository.findByUserAccountId(userAccountId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND)));
    }

    public EmployeeResponse getMyProfile() {
        String userAccountId = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeMapper.toEmployeeResponse(employeeRepository.findByUserAccountId(userAccountId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND)));
    }

    public PageResponse<EmployeeResponse> getAll(int page, int size){
        Sort sort = Sort.by("fullname").ascending();
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = employeeRepository.findAll(pageable);

        var employeeList = pageData.stream()
                .map(employeeMapper::toEmployeeResponse)
                .toList();

        return PageResponse.<EmployeeResponse>builder()
                .data(employeeList)
                .pageSize(pageData.getSize())
                .currentPage(page)
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .build();
    }

    public EmployeeResponse update(String employeeId, EmployeeUpdateRequest request) {
        var employee = findEmployeeById(employeeId);
        var branch = findBranchById(request.getBranchId());
        var department = findDepartmentByName(request.getDepartmentName());
        var position = findPositionByName(request.getPositionName());

        employeeMapper.updateEmployee(employee, request);
        employee.setBranch(branch);
        employee.setDepartment(department);
        employee.setPosition(position);

        employee = employeeRepository.save(employee);
        return employeeMapper.toEmployeeResponse(employee);
    }

    public EmployeeResponse updateStatus(String employeeId, String status) {
        var employee = findEmployeeById(employeeId);
        employee.setStatus(status);
        employee = employeeRepository.save(employee);
        return employeeMapper.toEmployeeResponse(employee);
    }

    public List<EmployeeResponse> getByBranch(String branchId) {
        findBranchById(branchId);
        return employeeRepository.findByBranchId(branchId).stream()
                .map(employeeMapper::toEmployeeResponse)
                .toList();
    }

    public List<EmployeeResponse> getByDepartment(String departmentId) {
        findDepartmentById(departmentId);
        return employeeRepository.findByDepartmentId(departmentId).stream()
                .map(employeeMapper::toEmployeeResponse)
                .toList();
    }

    public long countByBranch(String branchId) {
        findBranchById(branchId);
        return employeeRepository.countByBranchId(branchId);
    }

    private com.oppera.oppera_organization_service.entity.Branch findBranchById(String branchId) {
        return branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_FOUND));
    }

    private Department findDepartmentById(String departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
    }

    private Department findDepartmentByName(String departmentName) {
        return departmentRepository.findByName(departmentName)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
    }

    private Position findPositionByName(String positionName) {
        return positionRepository.findByName(positionName)
                .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
    }

    private com.oppera.oppera_organization_service.entity.Employee findEmployeeById(String employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
    }

}
