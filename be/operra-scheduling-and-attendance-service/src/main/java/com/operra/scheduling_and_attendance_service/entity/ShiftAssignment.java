package com.operra.scheduling_and_attendance_service.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(
        name = "shift_assignment",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_shift_assignment_work_date_employee",
                        columnNames = {"work_assign_id", "employee_id", "date"}
                )
        }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    // Cross-service reference to Organization Service employee
    @Column(name = "employee_id", nullable = false)
    String employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_assign_id", nullable = false)
    WorkAssignment workAssignment;

    @Column(nullable = false)
    LocalDate date;

    // Cross-service reference to the employee who assigned the shift
    @Column(name = "assigned_by", nullable = false)
    String assignedBy;
}
