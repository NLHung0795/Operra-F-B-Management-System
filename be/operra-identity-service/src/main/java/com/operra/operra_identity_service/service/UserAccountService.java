package com.operra.operra_identity_service.service;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.operra_identity_service.constant.PredefinedRole;
import com.operra.operra_common.dto.request.UserAccountCreationRequest;
import com.operra.operra_common.dto.response.UserAccountCreationResponse;
import com.operra.operra_identity_service.dto.request.UserAccountUpdateRequest;
import com.operra.operra_identity_service.dto.request.UserAccountAdminUpdateRequest;
import com.operra.operra_identity_service.dto.response.UserAccountUpdateResponse;
import com.operra.operra_identity_service.entity.Role;
import com.operra.operra_identity_service.entity.Permission;
import com.operra.operra_identity_service.mapper.UserAccountMapper;
import com.operra.operra_identity_service.repository.RoleRepository;
import com.operra.operra_identity_service.repository.PermissionRepository;
import com.operra.operra_identity_service.repository.UserAccountRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserAccountService {

    UserAccountRepository userAccountRepository;
    UserAccountMapper userAccountMapper;
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    PasswordEncoder passwordEncoder;

    public UserAccountCreationResponse createUserAccount(UserAccountCreationRequest request){
        if(userAccountRepository.existsByUsername(request.getUsername())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        var userAccount = userAccountMapper.toUserAccount(request);
        userAccount.setPassword(passwordEncoder.encode(request.getPassword()));

        Set<String> roleNames = new HashSet<>();
        if (Objects.nonNull(request.getRoles())) {
            request.getRoles().stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(role -> !role.isEmpty())
                    .map(String::toUpperCase)
                    .forEach(roleNames::add);
        }

        if (roleNames.isEmpty()) {
            roleNames.add(PredefinedRole.EMPLOYEE_ROLE);
        }

        HashSet<Role> roles = new HashSet<>(roleRepository.findAllById(roleNames));
        if (roles.size() != roleNames.size()) {
            throw new AppException(ErrorCode.USER_ACCOUNT_ERROR);
        }
        
        userAccount.setRoles(roles);

        // Map direct permissions
        Set<String> permissionNames = new HashSet<>();
        if (Objects.nonNull(request.getPermissions())) {
            request.getPermissions().stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(perm -> !perm.isEmpty())
                    .forEach(permissionNames::add);
        }

        HashSet<Permission> permissions = new HashSet<>(permissionRepository.findAllById(permissionNames));
        if (permissions.size() != permissionNames.size()) {
            throw new AppException(ErrorCode.USER_ACCOUNT_ERROR);
        }
        userAccount.setPermissions(permissions);

        userAccount.setCreationDate(Instant.now());
        if (request.getStatus() != null) {
            userAccount.setStatus(request.getStatus());
        } else {
            userAccount.setStatus("active"); // default status
        }
        userAccount.setMustChangePassword(true);

        userAccount = userAccountRepository.save(userAccount);

        return userAccountMapper.toUserAccountCreationResponse(userAccount);
    }

    public List<UserAccountCreationResponse> getAllUserAccount(){
        var users = userAccountRepository.findAll();

        return users.stream()
                .map(userAccountMapper::toUserAccountCreationResponse)
                .toList();
    }

    public UserAccountUpdateResponse update(UserAccountUpdateRequest request){
        String userAccountId = SecurityContextHolder.getContext().getAuthentication().getName();
        var userAccount = userAccountRepository.findById(userAccountId)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        userAccount.setPassword(passwordEncoder.encode(request.getPassword()));
        userAccount.setMustChangePassword(false);

        userAccountRepository.save(userAccount);

        return UserAccountUpdateResponse.builder()
                .status("success")
                .build();
    }

    public UserAccountCreationResponse adminUpdateUserAccount(String id, UserAccountAdminUpdateRequest request) {
        var userAccount = userAccountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (Objects.nonNull(request.getStatus())) {
            userAccount.setStatus(request.getStatus());
        }

        if (Objects.nonNull(request.getRoles())) {
            Set<String> roleNames = new HashSet<>();
            request.getRoles().stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(role -> !role.isEmpty())
                    .map(String::toUpperCase)
                    .forEach(roleNames::add);

            HashSet<Role> roles = new HashSet<>(roleRepository.findAllById(roleNames));
            if (roles.size() != roleNames.size()) {
                throw new AppException(ErrorCode.USER_ACCOUNT_ERROR);
            }
            userAccount.setRoles(roles);
        }

        if (Objects.nonNull(request.getPermissions())) {
            Set<String> permissionNames = new HashSet<>();
            request.getPermissions().stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(perm -> !perm.isEmpty())
                    .forEach(permissionNames::add);

            HashSet<Permission> permissions = new HashSet<>(permissionRepository.findAllById(permissionNames));
            if (permissions.size() != permissionNames.size()) {
                throw new AppException(ErrorCode.USER_ACCOUNT_ERROR);
            }
            userAccount.setPermissions(permissions);
        }

        userAccount = userAccountRepository.save(userAccount);
        return userAccountMapper.toUserAccountCreationResponse(userAccount);
    }

    public void deleteUserAccount(String id) {
        var userAccount = userAccountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userAccountRepository.delete(userAccount);
    }
}
