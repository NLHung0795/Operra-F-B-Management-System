package com.oppera.oppera_organization_service.repository;

import com.oppera.oppera_organization_service.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Optional<Employee> findByUserAccountId(String userAccountId);

    List<Employee> findByBranchId(String branchId);

    List<Employee> findByDepartmentId(String departmentId);

    long countByBranchId(String branchId);
}
