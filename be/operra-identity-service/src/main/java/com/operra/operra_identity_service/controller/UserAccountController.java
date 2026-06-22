package com.operra.operra_identity_service.controller;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.dto.request.UserAccountCreationRequest;
import com.operra.operra_common.dto.response.UserAccountCreationResponse;
import com.operra.operra_identity_service.dto.request.UserAccountUpdateRequest;
import com.operra.operra_identity_service.dto.request.UserAccountAdminUpdateRequest;
import com.operra.operra_identity_service.dto.response.UserAccountUpdateResponse;
import com.operra.operra_identity_service.service.UserAccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<List<UserAccountCreationResponse>> getAll(){
        return ApiResponse.<List<UserAccountCreationResponse>>builder()
                .result(userAccountService.getAllUserAccount())
                .build();
    }

    @PutMapping
    ApiResponse<UserAccountUpdateResponse> updatePassword(@RequestBody @Valid UserAccountUpdateRequest request){
        return ApiResponse.<UserAccountUpdateResponse>builder()
                .result(userAccountService.update(request))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<UserAccountCreationResponse> adminUpdate(@PathVariable String id, @RequestBody @Valid UserAccountAdminUpdateRequest request) {
        return ApiResponse.<UserAccountCreationResponse>builder()
                .result(userAccountService.adminUpdateUserAccount(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<String> delete(@PathVariable String id) {
        userAccountService.deleteUserAccount(id);
        return ApiResponse.<String>builder()
                .result("User account has been deleted")
                .build();
    }
}
