package com.operra.operra_identity_service.mapper;

import com.operra.operra_identity_service.dto.request.UserAccountCreationRequest;
import com.operra.operra_identity_service.dto.response.UserAccountCreationResponse;
import com.operra.operra_identity_service.entity.UserAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserAccountMapper {
    @Mapping(target = "roles", ignore = true)
    UserAccount toUserAccount(UserAccountCreationRequest request);
    UserAccountCreationResponse toUserAccountCreationResponse(UserAccount userAccount);
}
