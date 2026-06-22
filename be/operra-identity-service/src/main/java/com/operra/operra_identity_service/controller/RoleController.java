package com.operra.operra_identity_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_identity_service.dto.request.RoleRequest;
import com.operra.operra_identity_service.dto.response.RoleResponse;
import com.operra.operra_identity_service.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/roles")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {

    RoleService roleService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request){
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.create(request))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    ApiResponse<List<RoleResponse>> getAllRoles(){
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRole())
                .build();
    }
}
