package com.oppera.oppera_organization_service.service;

import com.oppera.oppera_organization_service.dto.request.DepartmentRequest;
import com.oppera.oppera_organization_service.dto.response.DepartmentResponse;
import com.oppera.oppera_organization_service.entity.Department;
import com.oppera.oppera_organization_service.mapper.DepartmentMapper;
import com.oppera.oppera_organization_service.repository.DepartmentRepository;
import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentService {
    DepartmentRepository departmentRepository;
    DepartmentMapper departmentMapper;

    public DepartmentResponse create(DepartmentRequest request) {
        var department = departmentMapper.toDepartment(request);
        department = departmentRepository.save(department);
        return departmentMapper.toDepartmentResponse(department);
    }

    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll()
                .stream()
                .map(departmentMapper::toDepartmentResponse)
                .toList();
    }

    public DepartmentResponse getById(String departmentId) {
        return departmentMapper.toDepartmentResponse(findEntityById(departmentId));
    }

    public DepartmentResponse update(String departmentId, DepartmentRequest request) {
        var department = findEntityById(departmentId);
        departmentMapper.updateDepartment(department, request);
        department = departmentRepository.save(department);
        return departmentMapper.toDepartmentResponse(department);
    }

    public void delete(String departmentId) {
        departmentRepository.delete(findEntityById(departmentId));
    }

    public Department findEntityById(String departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
    }
}
