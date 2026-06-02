package com.oppera.oppera_organization_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeUpdateRequest {
    @NotBlank
    String departmentName;

    @NotBlank
    String positionName;

    @NotBlank
    String branchId;

    @NotBlank
    String fullname;

    LocalDate dob;

    String phoneNumber;

    LocalDate hireDay;

    String status;
}
