package com.oppera.oppera_organization_service.mapper;

import com.oppera.oppera_organization_service.dto.request.DepartmentRequest;
import com.oppera.oppera_organization_service.dto.response.DepartmentResponse;
import com.oppera.oppera_organization_service.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    @Mapping(target = "employees", ignore = true)
    Department toDepartment(DepartmentRequest request);

    DepartmentResponse toDepartmentResponse(Department department);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employees", ignore = true)
    void updateDepartment(@MappingTarget Department department, DepartmentRequest request);
}
