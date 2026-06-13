package com.operra.scheduling_and_attendance_service.configuration;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class AuthenticationRequestInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate requestTemplate) {
        ServletRequestAttributes servletRequestAttributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes(); // Lấy request hiện tại từ thread

        if (servletRequestAttributes != null) {
            var authHeader = servletRequestAttributes.getRequest().getHeader("Authorization"); // Lấy JWT từ request gốc

            if (StringUtils.hasText(authHeader)) {
                requestTemplate.header("Authorization", authHeader); //Gắn JWT vào request mới
            }
        }
    }
}
