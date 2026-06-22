package com.operra.operra_common.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAccountCreationRequest {
    String username;
    String password;
    @NotNull
    String email;
    Instant creationDate;
    String status;
    List<String> roles;
    List<String> permissions;
}
