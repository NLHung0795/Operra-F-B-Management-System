package com.oppera.oppera_organization_service.mapper;

import com.oppera.oppera_organization_service.dto.request.CompanyRequest;
import com.oppera.oppera_organization_service.dto.response.CompanyResponse;
import com.oppera.oppera_organization_service.entity.Company;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanyMapper {
    Company toCompany(CompanyRequest request);
    CompanyResponse toCompanyResponse(Company company);
}
