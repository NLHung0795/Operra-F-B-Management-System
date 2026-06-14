package com.oppera.oppera_organization_service.mapper;

import com.oppera.oppera_organization_service.dto.request.BranchRequest;
import com.operra.operra_common.dto.response.BranchResponse;
import com.oppera.oppera_organization_service.entity.Branch;
import com.oppera.oppera_organization_service.entity.BranchAllowedIp;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface BranchMapper {
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "employees", ignore = true)
    @Mapping(target = "allowedIpAddresses", ignore = true)
    Branch toBranch(BranchRequest request);

    @Mapping(target = "companyId", source = "company.id")
    @Mapping(target = "allowedIpAddresses", source = "allowedIpAddresses", qualifiedByName = "mapAllowedIpsToStrings")
    BranchResponse toBranchResponse(Branch branch);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "employees", ignore = true)
    @Mapping(target = "allowedIpAddresses", ignore = true)
    void updateBranch(@MappingTarget Branch branch, BranchRequest request);

    @Named("mapAllowedIpsToStrings")
    default List<String> mapAllowedIpsToStrings(Set<BranchAllowedIp> allowedIps) {
        if (allowedIps == null) {
            return Collections.emptyList();
        }
        return allowedIps.stream()
                .map(BranchAllowedIp::getIpAddress)
                .toList();
    }
}
