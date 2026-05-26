package com.operra.operra_common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "UNCATEGORIZE ERROR", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHORIZED(1002,"do not have permission", HttpStatus.FORBIDDEN),
    USER_EXISTED(1001, "user existed", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1003,"UNAUTHENTICATED", HttpStatus.UNAUTHORIZED),
    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode){
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public HttpStatusCode getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(HttpStatusCode statusCode) {
        this.statusCode = statusCode;
    }
}
