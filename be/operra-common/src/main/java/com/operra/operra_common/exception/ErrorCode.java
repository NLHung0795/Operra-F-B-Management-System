package com.operra.operra_common.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "UNCATEGORIZE ERROR", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHORIZED(1002,"do not have permission", HttpStatus.FORBIDDEN),
    USER_EXISTED(1001, "user existed", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1003,"UNAUTHENTICATED", HttpStatus.UNAUTHORIZED),
    USER_NOT_EXISTED(1004,"user not existed", HttpStatus.BAD_REQUEST),
    USER_ACCOUNT_ERROR(1005,"user account error", HttpStatus.BAD_REQUEST),
    COMPANY_NOT_FOUND(2001, "company not found", HttpStatus.NOT_FOUND),
    BRANCH_NOT_FOUND(2002, "branch not found", HttpStatus.NOT_FOUND),
    DEPARTMENT_NOT_FOUND(2003, "department not found", HttpStatus.NOT_FOUND),
    POSITION_NOT_FOUND(2004, "position not found", HttpStatus.NOT_FOUND),
    EMPLOYEE_NOT_FOUND(2005, "employee not found", HttpStatus.NOT_FOUND),
    EMPLOYEE_NOT_ACTIVE(2006, "employee not active", HttpStatus.BAD_REQUEST),
    ASSIGNER_NOT_FOUND(2007, "assigner not found", HttpStatus.NOT_FOUND),
    WORK_ASSIGNMENT_NOT_FOUND(3001, "work assignment not found", HttpStatus.NOT_FOUND),
    SHIFT_ASSIGNMENT_EXISTED(3002, "shift assignment existed", HttpStatus.BAD_REQUEST),
    SHIFT_ASSIGNMENT_NOT_FOUND(3003, "shift assignment not found", HttpStatus.NOT_FOUND),
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
