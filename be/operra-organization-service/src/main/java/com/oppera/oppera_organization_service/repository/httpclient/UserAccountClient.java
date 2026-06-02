package com.oppera.oppera_organization_service.repository.httpclient;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.dto.request.UserAccountCreationRequest;
import com.operra.operra_common.dto.response.UserAccountCreationResponse;
import com.oppera.oppera_organization_service.configuration.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "useraccount-service", url = "${app.services.user_account}",
        configuration = AuthenticationRequestInterceptor.class)
public interface UserAccountClient {
    @PostMapping(value = "/useraccounts/registration", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<UserAccountCreationResponse> createUserAccount(@RequestBody UserAccountCreationRequest request);
}
