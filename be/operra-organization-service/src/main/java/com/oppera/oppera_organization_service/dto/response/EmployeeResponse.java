package com.oppera.oppera_organization_service.dto.response;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeResponse {
    String departmentName;
    String positionName;
    String branchName;
    String fullname;
    LocalDate dob;
    String phoneNumber;
    LocalDate hireDay;
    String status;
}
