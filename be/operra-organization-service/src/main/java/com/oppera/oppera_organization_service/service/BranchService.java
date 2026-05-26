package com.oppera.oppera_organization_service.service;

import com.oppera.oppera_organization_service.dto.request.BranchRequest;
import com.oppera.oppera_organization_service.dto.response.BranchResponse;
import com.oppera.oppera_organization_service.entity.Branch;
import com.oppera.oppera_organization_service.mapper.BranchMapper;
import com.oppera.oppera_organization_service.repository.BranchRepository;
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
public class BranchService {
    BranchRepository branchRepository;
    BranchMapper branchMapper;
    CompanyService companyService;

    public BranchResponse create(String companyId, BranchRequest request) {
        var branch = branchMapper.toBranch(request);
        branch.setCompany(companyService.findEntityById(companyId));
        branch = branchRepository.save(branch);
        return branchMapper.toBranchResponse(branch);
    }

    public List<BranchResponse> getAll(){
        return branchRepository.findAll()
                .stream()
                .map(branchMapper::toBranchResponse)
                .toList();
    }

    public List<BranchResponse> getByCompany(String companyId) {
        companyService.findEntityById(companyId);
        return branchRepository.findByCompanyId(companyId)
                .stream()
                .map(branchMapper::toBranchResponse)
                .toList();
    }

    public BranchResponse getById(String companyId, String branchId) {
        companyService.findEntityById(companyId);
        var branch = findEntityById(branchId);
        if (!branch.getCompany().getId().equals(companyId)) {
            throw new AppException(ErrorCode.BRANCH_NOT_FOUND);
        }
        return branchMapper.toBranchResponse(branch);
    }

    public BranchResponse update(String companyId, String branchId, BranchRequest request) {
        companyService.findEntityById(companyId);
        var branch = findEntityById(branchId);
        if (!branch.getCompany().getId().equals(companyId)) {
            throw new AppException(ErrorCode.BRANCH_NOT_FOUND);
        }

        branchMapper.updateBranch(branch, request);
        branch = branchRepository.save(branch);
        return branchMapper.toBranchResponse(branch);
    }

    public void delete(String companyId, String branchId) {
        companyService.findEntityById(companyId);
        var branch = findEntityById(branchId);
        if (!branch.getCompany().getId().equals(companyId)) {
            throw new AppException(ErrorCode.BRANCH_NOT_FOUND);
        }
        branchRepository.delete(branch);
    }

    public List<BranchResponse> getByStatus(String status) {
        return branchRepository.findByStatus(status)
                .stream()
                .map(branchMapper::toBranchResponse)
                .toList();
    }

    public BranchResponse updateStatus(String branchId, String status) {
        var branch = findEntityById(branchId);
        branch.setStatus(status);
        branch = branchRepository.save(branch);
        return branchMapper.toBranchResponse(branch);
    }

    private Branch findEntityById(String branchId) {
        return branchRepository.findById(branchId)
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_FOUND));
    }
}
