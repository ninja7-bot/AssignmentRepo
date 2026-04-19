package com.training.todo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
        System.out.println("\n==========================================");
        System.out.println("        TODO Application Started!           ");
        System.out.println("============================================");
        System.out.println("   API URL  : http://localhost:8080/tasks");
        System.out.println("   H2 Console: http://localhost:8080/h2-console");
        System.out.println("   DB URL   : jdbc:h2:mem:tododb");
        System.out.println("   Username : su");
        System.out.println("   Password : ''");
        System.out.println("==========================================\n");
    }
}
