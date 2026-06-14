package com.operra.operra_common.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeResponse {
    String id;
    String departmentName;
    String positionName;
    String branchId;
    String fullname;
    LocalDate dob;
    String phoneNumber;
    LocalDate hireDay;
    String status;
}
