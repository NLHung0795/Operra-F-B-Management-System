package com.operra.api_gateway.repository.httpclient;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.dto.request.IntrospectRequest;
import com.operra.operra_common.dto.response.IntrospectResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.PostExchange;
import reactor.core.publisher.Mono;

@Component
public interface IdentityClient {
    @PostExchange(value = "/auth/introspect",  contentType= MediaType.APPLICATION_JSON_VALUE)
    Mono<ApiResponse<IntrospectResponse>> introspect(@RequestBody IntrospectRequest request);

}
