package com.oppera.oppera_organization_service.repository;

import com.oppera.oppera_organization_service.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, String> {
}
