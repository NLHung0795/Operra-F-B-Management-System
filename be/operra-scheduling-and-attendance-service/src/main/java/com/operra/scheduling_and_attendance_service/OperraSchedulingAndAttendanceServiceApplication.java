package com.operra.scheduling_and_attendance_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class OperraSchedulingAndAttendanceServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OperraSchedulingAndAttendanceServiceApplication.class, args);
	}

}
