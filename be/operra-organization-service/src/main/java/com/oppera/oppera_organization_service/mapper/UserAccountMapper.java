package com.oppera.oppera_organization_service.mapper;

import com.operra.operra_common.dto.request.UserAccountCreationRequest;
import com.oppera.oppera_organization_service.dto.request.EmployeeRequest;
import org.mapstruct.Mapper;
import org.springframework.util.StringUtils;

@Mapper(componentModel = "spring")
public interface UserAccountMapper {
    default UserAccountCreationRequest toUserAccountCreationRequest(EmployeeRequest request) {
        if (request == null) {
            return null;
        }

        return UserAccountCreationRequest.builder()
                .username(StringUtils.trimAllWhitespace(request.getFullname()).toLowerCase())
                .password("12345678")
                .email(request.getEmail())
                .status(request.getStatus())
                .roles(request.getRoles())
                .creationDate(java.time.Instant.now())
                .build();
    }
}
