package com.operra.api_gateway.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        // Gateway dung WebFlux nen phai cau hinh SecurityWebFilterChain, khong dung SecurityFilterChain cua Servlet.
        // Cho Spring Security di qua tat ca request, viec kiem tra JWT se do AuthenticationFilter xu ly.
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange.anyExchange().permitAll())
                .build();
    }
}
