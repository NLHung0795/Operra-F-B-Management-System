package com.operra.operra_common.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data // tu tao getter, setter
@NoArgsConstructor
@AllArgsConstructor // tu tao 2 constructor co du gtri va ko du gtri
@Builder // dung de tao object
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IntrospectResponse {

    boolean valid;
    String userId;
}
