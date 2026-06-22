package com.oppera.oppera_organization_service.service;

import com.oppera.oppera_organization_service.dto.request.BranchRequest;
import com.operra.operra_common.dto.response.BranchResponse;
import com.oppera.oppera_organization_service.entity.Branch;
import com.oppera.oppera_organization_service.entity.BranchAllowedIp;
import com.oppera.oppera_organization_service.mapper.BranchMapper;
import com.oppera.oppera_organization_service.repository.BranchAllowedIpRepository;
import com.oppera.oppera_organization_service.repository.BranchRepository;
import com.oppera.oppera_organization_service.repository.EmployeeRepository;
import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BranchService {
    BranchRepository branchRepository;
    BranchAllowedIpRepository branchAllowedIpRepository;
    BranchMapper branchMapper;
    CompanyService companyService;
    EmployeeRepository employeeRepository;

    @Transactional
    public BranchResponse create(String companyId, BranchRequest request) {
        var branch = branchMapper.toBranch(request);
        branch.setCompany(companyService.findEntityById(companyId));
        branch = branchRepository.save(branch);

        saveAllowedIps(branch, request.getAllowedIpAddresses());

        return branchMapper.toBranchResponse(branch);
    }

    public List<BranchResponse> getAll(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            boolean isManager = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (isManager && !isAdmin) {
                String userAccountId = authentication.getName();
                var employee = employeeRepository.findByUserAccountId(userAccountId)
                        .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
                String companyId = employee.getBranch().getCompany().getId();
                return getByCompany(companyId);
            }
        }

        return branchRepository.findAll()
                .stream()
                .map(branchMapper::toBranchResponse)
                .toList();
    }

    public List<BranchResponse> getByCompany(String companyId) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            boolean isManager = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (isManager && !isAdmin) {
                String userAccountId = authentication.getName();
                var employee = employeeRepository.findByUserAccountId(userAccountId)
                        .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
                String managerCompanyId = employee.getBranch().getCompany().getId();
                if (!managerCompanyId.equals(companyId)) {
                    throw new AppException(ErrorCode.UNAUTHORIZED);
                }
            }
        }

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

    @Transactional
    public BranchResponse update(String companyId, String branchId, BranchRequest request) {
        companyService.findEntityById(companyId);
        var branch = findEntityById(branchId);
        if (!branch.getCompany().getId().equals(companyId)) {
            throw new AppException(ErrorCode.BRANCH_NOT_FOUND);
        }

        branchMapper.updateBranch(branch, request);

        // Update allowed IPs: clear existing managed collection, then add new items
        // IMPORTANT: never replace the Set reference — Hibernate tracks the original collection
        if (request.getAllowedIpAddresses() != null) {
            if (branch.getAllowedIpAddresses() != null) {
                branch.getAllowedIpAddresses().clear();
            } else {
                branch.setAllowedIpAddresses(new HashSet<>());
            }

            for (String ip : request.getAllowedIpAddresses()) {
                var allowedIp = BranchAllowedIp.builder()
                        .branch(branch)
                        .ipAddress(ip)
                        .build();
                branch.getAllowedIpAddresses().add(allowedIp);
            }
        }

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
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            boolean isManager = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_MANAGER"));
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            
            if (isManager && !isAdmin) {
                String userAccountId = authentication.getName();
                var employee = employeeRepository.findByUserAccountId(userAccountId)
                        .orElseThrow(() -> new AppException(ErrorCode.EMPLOYEE_NOT_FOUND));
                String companyId = employee.getBranch().getCompany().getId();
                return branchRepository.findByCompanyId(companyId)
                        .stream()
                        .filter(branch -> status.equals(branch.getStatus()))
                        .map(branchMapper::toBranchResponse)
                        .toList();
            }
        }

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

    public BranchResponse getInternalById(String branchId) {
        var branch = findEntityById(branchId);
        return branchMapper.toBranchResponse(branch);
    }

    private void saveAllowedIps(Branch branch, List<String> ipAddresses) {
        if (ipAddresses == null || ipAddresses.isEmpty()) {
            return;
        }

        Set<BranchAllowedIp> allowedIps = new HashSet<>();
        for (String ip : ipAddresses) {
            var allowedIp = BranchAllowedIp.builder()
                    .branch(branch)
                    .ipAddress(ip)
                    .build();
            allowedIps.add(allowedIp);
        }
        branchAllowedIpRepository.saveAll(allowedIps);
        branch.setAllowedIpAddresses(allowedIps);
    }
}
