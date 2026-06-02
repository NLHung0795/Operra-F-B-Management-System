package com.operra.operra_identity_service.service;

import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.operra_identity_service.constant.PredefinedRole;
import com.operra.operra_common.dto.request.UserAccountCreationRequest;
import com.operra.operra_common.dto.response.UserAccountCreationResponse;
import com.operra.operra_identity_service.dto.request.UserAccountUpdateRequest;
import com.operra.operra_identity_service.dto.response.UserAccountUpdateResponse;
import com.operra.operra_identity_service.entity.Role;
import com.operra.operra_identity_service.mapper.UserAccountMapper;
import com.operra.operra_identity_service.repository.RoleRepository;
import com.operra.operra_identity_service.repository.UserAccountRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserAccountService {

    UserAccountRepository userAccountRepository;
    UserAccountMapper userAccountMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;

    public UserAccountCreationResponse createUserAccount(UserAccountCreationRequest request){
        if(userAccountRepository.existsByUsername(request.getUsername())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        var userAccount = userAccountMapper.toUserAccount(request);
        userAccount.setPassword(passwordEncoder.encode(request.getPassword()));

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(role -> roles.add(role));
        userAccount.setRoles(roles);

        userAccount.setCreationDate(Instant.now());
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
}
