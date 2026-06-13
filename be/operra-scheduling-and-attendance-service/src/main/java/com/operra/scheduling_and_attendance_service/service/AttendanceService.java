package com.operra.scheduling_and_attendance_service.service;

import com.operra.scheduling_and_attendance_service.repository.AttendanceRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AttendanceService {
    AttendanceRepository attendanceRepository;


}
