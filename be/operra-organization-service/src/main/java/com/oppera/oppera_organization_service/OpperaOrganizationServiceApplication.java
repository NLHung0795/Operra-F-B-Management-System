package com.oppera.oppera_organization_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class OpperaOrganizationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OpperaOrganizationServiceApplication.class, args);
	}

}
