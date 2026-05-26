package com.operra.operra_identity_service.service;

import com.operra.operra_identity_service.dto.request.RoleRequest;
import com.operra.operra_identity_service.dto.response.RoleResponse;
import com.operra.operra_identity_service.entity.Permission;
import com.operra.operra_identity_service.mapper.RoleMapper;
import com.operra.operra_identity_service.repository.PermissionRepository;
import com.operra.operra_identity_service.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    public RoleResponse create(RoleRequest request){
        var role = roleMapper.toRole(request);

        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));

        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAllRole(){
        return roleRepository.findAll()
                .stream()
                .map(role -> roleMapper.toRoleResponse(role))
                .toList();
    }
}
