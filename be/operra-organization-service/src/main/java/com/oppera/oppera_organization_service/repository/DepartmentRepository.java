package com.oppera.oppera_organization_service.repository;

import com.oppera.oppera_organization_service.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, String> {
}
