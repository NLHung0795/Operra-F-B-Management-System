package com.oppera.oppera_organization_service.repository;

import com.oppera.oppera_organization_service.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    List<Employee> findByBranchId(String branchId);

    List<Employee> findByDepartmentId(String departmentId);
}
