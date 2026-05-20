package com.operra.operra_identity_service.dto.request;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.antlr.v4.runtime.misc.NotNull;

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
}
