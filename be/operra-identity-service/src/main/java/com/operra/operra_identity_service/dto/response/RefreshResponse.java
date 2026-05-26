package com.example.curdandmysql.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshResponse {  // giong voi AuthenticationResponse
    String token;
    boolean authenticated; // true: cung cap username va pass dusng
}
