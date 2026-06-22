package com.operra.operra_identity_service.service;

import com.operra.operra_identity_service.dto.request.PermissionRequest;
import com.operra.operra_identity_service.dto.request.PermissionUpdateRequest;
import com.operra.operra_identity_service.dto.response.PermissionResponse;
import com.operra.operra_identity_service.dto.response.PermissionUpdateResponse;
import com.operra.operra_identity_service.entity.Permission;
import com.operra.operra_identity_service.mapper.PermissionMapper;
import com.operra.operra_identity_service.repository.PermissionRepository;
import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // tu tao constructor cho cac bien ma dc define la final -> ko can autowired nua
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PermissionService {

    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse create(PermissionRequest request){
        Permission permission = permissionMapper.toPermission(request);

        permissionRepository.save(permission);

        return permissionMapper.toPermissionResponse(permission);
    }

    public List<PermissionResponse> getAll(){
        return permissionRepository.findAll().stream().map(permission -> permissionMapper.toPermissionResponse(permission)).toList();
    }

    public PermissionUpdateResponse update(String name, PermissionUpdateRequest request) {
        var permission = permissionRepository.findById(name)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));

        permission.setDescription(request.getDescription());
        permission = permissionRepository.save(permission);
        return permissionMapper.toPermissionUpdateResponse(permission);
    }

    public void delete(String name) {
        var permission = permissionRepository.findById(name)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_FOUND));
        permissionRepository.delete(permission);
    }
}
