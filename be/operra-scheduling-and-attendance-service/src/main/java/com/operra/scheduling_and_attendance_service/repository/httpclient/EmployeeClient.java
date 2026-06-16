package com.operra.scheduling_and_attendance_service.repository.httpclient;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.dto.response.EmployeeResponse;
import com.operra.scheduling_and_attendance_service.configuration.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "employee-client", url = "${app.services.organization}",
        configuration = AuthenticationRequestInterceptor.class)
public interface EmployeeClient {
    @GetMapping(value = "/internal/employees/{employeeId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<EmployeeResponse> getEmployee(@PathVariable("employeeId") String employeeId);

    @GetMapping(value = "/internal/employees/user-account/{userAccountId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<EmployeeResponse> getEmployeeByUserAccountId(@PathVariable("userAccountId") String userAccountId);

    @GetMapping(value = "/internal/employees/branch/{branchId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<List<EmployeeResponse>> getEmployeesByBranch(@PathVariable("branchId") String branchId);
}
