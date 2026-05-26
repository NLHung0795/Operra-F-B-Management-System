package com.oppera.oppera_organization_service.service;

import com.oppera.oppera_organization_service.dto.request.CompanyRequest;
import com.oppera.oppera_organization_service.dto.response.CompanyResponse;
import com.oppera.oppera_organization_service.entity.Company;
import com.oppera.oppera_organization_service.mapper.CompanyMapper;
import com.oppera.oppera_organization_service.repository.CompanyRepository;
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
public class CompanyService {
    CompanyRepository companyRepository;
    CompanyMapper companyMapper;

    public CompanyResponse create(CompanyRequest request) {
        var company = companyMapper.toCompany(request);
        company = companyRepository.save(company);
        return companyMapper.toCompanyResponse(company);
    }

    public List<CompanyResponse> getAll() {
        return companyRepository.findAll()
                .stream()
                .map(companyMapper::toCompanyResponse)
                .toList();
    }

    public CompanyResponse getById(String companyId) {
        return companyMapper.toCompanyResponse(findEntityById(companyId));
    }

    public CompanyResponse update(String companyId, CompanyRequest request) {
        var company = findEntityById(companyId);
        company.setName(request.getName());
        company.setTaxCode(request.getTaxCode());
        company = companyRepository.save(company);
        return companyMapper.toCompanyResponse(company);
    }

    public void delete(String companyId) {
        companyRepository.delete(findEntityById(companyId));
    }

    public Company findEntityById(String companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new AppException(ErrorCode.COMPANY_NOT_FOUND));
    }
}
