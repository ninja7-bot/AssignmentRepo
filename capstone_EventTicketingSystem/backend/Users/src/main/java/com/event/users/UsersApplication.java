package com.event.users;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UsersApplication {

    public static void main(String[] args) {
        SpringApplication.run(UsersApplication.class, args);
        System.out.println("----------------------------------------------------");
        System.out.println("|--> User Microservice Service is up and  running.  |");
        System.out.println("|--> Running on http://localhost:8081               |");
        System.out.println("----------------------------------------------------");
    }
}
