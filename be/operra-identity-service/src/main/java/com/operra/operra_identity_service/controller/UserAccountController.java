package com.operra.operra_identity_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.dto.request.UserAccountCreationRequest;
import com.operra.operra_common.dto.response.UserAccountCreationResponse;
import com.operra.operra_identity_service.dto.request.UserAccountUpdateRequest;
import com.operra.operra_identity_service.dto.response.UserAccountUpdateResponse;
import com.operra.operra_identity_service.service.UserAccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/useraccounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserAccountController {
    UserAccountService userAccountService;

    @PostMapping("/registration")
    ApiResponse<UserAccountCreationResponse> create(@RequestBody @Valid UserAccountCreationRequest request){
        return ApiResponse.<UserAccountCreationResponse>builder()
                .result(userAccountService.createUserAccount(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<UserAccountCreationResponse>> getAll(){
        return ApiResponse.<List<UserAccountCreationResponse>>builder()
                .result(userAccountService.getAllUserAccount())
                .build();
    }

    @PutMapping
    ApiResponse<UserAccountUpdateResponse> updatePassword(UserAccountUpdateRequest request){
        return ApiResponse.<UserAccountUpdateResponse>builder()
                .result(userAccountService.update(request))
                .build();
    }
}
