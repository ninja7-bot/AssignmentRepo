package com.training.ems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EmployeeManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeManagementSystemApplication.class, args);

        System.out.println("==========================================");
        System.out.println("   Employee Management System Started!    ");
        System.out.println("   URL: http://localhost:8080             ");
        System.out.println("==========================================");
    }
}
