package com.operra.operra_identity_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAccountAdminUpdateRequest {
    List<String> roles;
    List<String> permissions;
    String status;
}
