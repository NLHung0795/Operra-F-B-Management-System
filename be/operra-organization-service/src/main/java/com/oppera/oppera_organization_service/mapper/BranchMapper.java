package com.oppera.oppera_organization_service.mapper;

import com.oppera.oppera_organization_service.dto.request.BranchRequest;
import com.oppera.oppera_organization_service.dto.response.BranchResponse;
import com.oppera.oppera_organization_service.entity.Branch;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BranchMapper {
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "employees", ignore = true)
    Branch toBranch(BranchRequest request);

    @Mapping(target = "companyId", source = "company.id")
    BranchResponse toBranchResponse(Branch branch);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "employees", ignore = true)
    void updateBranch(@MappingTarget Branch branch, BranchRequest request);
}
