package com.operra.operra_identity_service.service;

import com.operra.operra_identity_service.dto.request.PermissionRequest;
import com.operra.operra_identity_service.dto.response.PermissionResponse;
import com.operra.operra_identity_service.entity.Permission;
import com.operra.operra_identity_service.mapper.PermissionMapper;
import com.operra.operra_identity_service.repository.PermissionRepository;
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


}
