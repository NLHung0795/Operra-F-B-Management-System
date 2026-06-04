package com.operra.scheduling_and_attendance_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Table(name = "attendance")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    // Cross-service reference to Organization Service employee
    @Column(name = "employee_id", nullable = false)
    String employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_assignment_id", nullable = false)
    ShiftAssignment shiftAssignment;

    @Column(name = "check_in_time")
    Instant checkInTime;

    @Column(name = "check_out_time")
    Instant checkOutTime;

    String method;

    String location;

    String status;
}
