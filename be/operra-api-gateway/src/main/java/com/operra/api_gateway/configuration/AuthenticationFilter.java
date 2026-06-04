package com.operra.api_gateway.configuration;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.operra.api_gateway.service.IdentityService;
import com.operra.operra_common.dto.ApiResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationFilter implements GlobalFilter, Ordered {

    IdentityService identityService;
    ObjectMapper objectMapper;

    @NonFinal
    private String[] publicEndpoints = {
        "/identity/auth/.*", "/identity/useraccounts/.*"
    };

    @Value("${app.api-prefix}")
    @NonFinal
    private String apiPrefix;

    @Override
    public int getOrder() {
        return -1;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("filter");
        if(isPublicEndpoint(exchange.getRequest())){
            return chain.filter(exchange);
        }

        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (CollectionUtils.isEmpty(authHeader)) {
            try {
                return unauthenticated(exchange.getResponse());
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }

        String token = authHeader.getFirst().replace("Bearer ", "");
//        log.info("Token {}", token);

        return identityService.introspect(token).flatMap(introspectResponse ->{
            if(introspectResponse.getResult().isValid()){
                return chain.filter(exchange);
            }

            else {
                try {
                    return unauthenticated(exchange.getResponse());
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
        }).onErrorResume(throwable -> {
            try {
                return unauthenticated(exchange.getResponse());
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });

    }

    private boolean isPublicEndpoint(ServerHttpRequest request){
        return Arrays.stream(publicEndpoints)
                .anyMatch(s -> request.getURI().getPath().matches(apiPrefix+s));
    }

    Mono<Void> unauthenticated(ServerHttpResponse response) throws JsonProcessingException {
        ApiResponse<?> apiRespone = ApiResponse.builder()
                .code(1401)
                .message("Unauthenticated")
                .build();

        String body = null;
        body = objectMapper.writeValueAsString(apiRespone);

        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }

}
