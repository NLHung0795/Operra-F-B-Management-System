package com.oppera.oppera_organization_service.repository;

import com.oppera.oppera_organization_service.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BranchRepository extends JpaRepository<Branch, String> {
    List<Branch> findByCompanyId(String companyId);
    List<Branch> findByStatus(String status);
}
