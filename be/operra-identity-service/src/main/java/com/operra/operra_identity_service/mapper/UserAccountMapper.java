package com.operra.operra_identity_service.mapper;

import com.operra.operra_common.dto.request.UserAccountCreationRequest;
import com.operra.operra_common.dto.response.UserAccountCreationResponse;
import com.operra.operra_identity_service.entity.Role;
import com.operra.operra_identity_service.entity.UserAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserAccountMapper {
    @Mapping(target = "roles", ignore = true)
    UserAccount toUserAccount(UserAccountCreationRequest request);
    @Mapping(target = "roles", source = "roles")
    UserAccountCreationResponse toUserAccountCreationResponse(UserAccount userAccount);

    default Set<String> mapRoles(Set<Role> roles) {
        if (roles == null) {
            return null;
        }

        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
    }
}
