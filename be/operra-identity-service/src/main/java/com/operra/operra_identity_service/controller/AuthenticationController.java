package com.operra.operra_identity_service.controller;

import com.nimbusds.jose.JOSEException;
import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.dto.request.IntrospectRequest;
import com.operra.operra_common.dto.response.IntrospectResponse;
import com.operra.operra_identity_service.dto.request.AuthenticationRequest;
import com.operra.operra_identity_service.dto.request.LogoutRequest;
import com.operra.operra_identity_service.dto.request.RefreshRequest;
import com.operra.operra_identity_service.dto.response.AuthenticationResponse;
import com.operra.operra_identity_service.dto.response.RefreshResponse;
import com.operra.operra_identity_service.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }


    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping("/refresh")
    ApiResponse<RefreshResponse> refreshToken(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        return ApiResponse.<RefreshResponse>builder()
                .result(authenticationService.refreshToken(request))
                .build();
    }


}
