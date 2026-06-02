package com.operra.operra_common.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserAccountCreationResponse {
    String id;
    String username;
    String email;
    Instant creationDate;
    Set<String> roles;
}
