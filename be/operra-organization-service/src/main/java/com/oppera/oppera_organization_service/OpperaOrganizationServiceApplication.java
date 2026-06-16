package com.oppera.oppera_organization_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication(scanBasePackages = {
		"com.oppera.oppera_organization_service",
		"com.operra.operra_common"
})
@EnableFeignClients
@EnableKafka
public class OpperaOrganizationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(OpperaOrganizationServiceApplication.class, args);
	}

}
