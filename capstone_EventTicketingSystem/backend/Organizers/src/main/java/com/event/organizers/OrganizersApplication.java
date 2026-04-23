package com.event.organizers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrganizersApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrganizersApplication.class, args);
        System.out.println("----------------------------------------------------------");
        System.out.println("|--> Organizer Service is running on http://localhost:8082");
        System.out.println("----------------------------------------------------------");
    }

}
