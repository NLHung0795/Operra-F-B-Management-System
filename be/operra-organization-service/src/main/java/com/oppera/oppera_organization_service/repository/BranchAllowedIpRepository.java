package com.oppera.oppera_organization_service.repository;

import com.oppera.oppera_organization_service.entity.BranchAllowedIp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BranchAllowedIpRepository extends JpaRepository<BranchAllowedIp, String> {
    List<BranchAllowedIp> findByBranchId(String branchId);

    boolean existsByBranchIdAndIpAddress(String branchId, String ipAddress);

    void deleteByBranchId(String branchId);
}
