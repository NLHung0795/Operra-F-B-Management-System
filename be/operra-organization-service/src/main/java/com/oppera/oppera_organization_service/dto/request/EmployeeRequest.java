package com.oppera.oppera_organization_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeRequest {
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

    @NotBlank
    String username;

    @NotBlank
    @Email
    String email;

    List<String> roles;
}
