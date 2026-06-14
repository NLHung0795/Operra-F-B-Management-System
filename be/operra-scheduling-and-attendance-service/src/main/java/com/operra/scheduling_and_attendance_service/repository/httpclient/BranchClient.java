package com.operra.scheduling_and_attendance_service.repository.httpclient;

import com.operra.operra_common.dto.ApiResponse;
import com.operra.operra_common.dto.response.BranchResponse;
import com.operra.scheduling_and_attendance_service.configuration.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "branch-client", url = "${app.services.organization}",
        configuration = AuthenticationRequestInterceptor.class)
public interface BranchClient {
    @GetMapping(value = "/internal/branches/{branchId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<BranchResponse> getBranch(@PathVariable("branchId") String branchId);
}
