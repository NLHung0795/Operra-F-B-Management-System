package com.operra.operra_common.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.aot.generate.Generated;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeEvent{
    String eventId;
    String eventType; // employee.created, employee.updated, employee.deactivated
    String employeeId;
    String branchId;
    String departmentId;
    String positionId;
    String status;
    Instant occurredAt;
}
