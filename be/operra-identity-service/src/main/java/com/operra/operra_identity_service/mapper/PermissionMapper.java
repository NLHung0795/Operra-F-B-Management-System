package com.operra.operra_identity_service.mapper;

import com.operra.operra_identity_service.dto.request.PermissionRequest;
import com.operra.operra_identity_service.dto.request.PermissionUpdateRequest;
import com.operra.operra_identity_service.dto.response.PermissionResponse;
import com.operra.operra_identity_service.dto.response.PermissionUpdateResponse;
import com.operra.operra_identity_service.entity.Permission;
import com.operra.operra_identity_service.service.PermissionService;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);
    Permission toPermission(PermissionUpdateRequest request);
    PermissionUpdateResponse toPermissionUpdateResponse(Permission permission);
}
