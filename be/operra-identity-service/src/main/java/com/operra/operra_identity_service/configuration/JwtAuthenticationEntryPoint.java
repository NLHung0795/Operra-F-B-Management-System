package com.operra.operra_identity_service.configuration;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.exception.ErrorCode;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    //Xử lý khi request không được xác thực (unauthenticated).
    //Thay vì Spring Security trả về lỗi mặc định (HTML error page), bạn custom JSON response chuẩn API.


    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response /* giup tra ve noi dung mong muon*/ , AuthenticationException authException)
            throws IOException, ServletException {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

        response.setStatus(errorCode.getStatusCode().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<?> apiRespone = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        ObjectMapper mapper = new ObjectMapper();

        response.getWriter().write(mapper.writeValueAsString(apiRespone));
        response.flushBuffer();
    }
}
