package com.oppera.oppera_organization_service.mapper;

import com.oppera.oppera_organization_service.dto.request.EmployeeRequest;
import com.oppera.oppera_organization_service.dto.request.EmployeeUpdateRequest;
import com.operra.operra_common.dto.response.EmployeeResponse;
import com.oppera.oppera_organization_service.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    Employee toEmployee(EmployeeRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "position", ignore = true)
    void updateEmployee(@MappingTarget Employee employee, EmployeeUpdateRequest request);

    @Mapping(target = "branchId", source = "branch.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "positionName", source = "position.name")
    EmployeeResponse toEmployeeResponse(Employee employee);
}
