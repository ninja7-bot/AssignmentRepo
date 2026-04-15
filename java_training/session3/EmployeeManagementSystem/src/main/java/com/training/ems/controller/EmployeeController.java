package com.training.ems.controller;

import com.training.ems.model.Employee;
import com.training.ems.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * EmployeeController - REST API Controller
 *
 * @RestController = @Controller + @ResponseBody
 *   - Handles HTTP requests
 *   - Automatically converts return values to JSON
 *
 * @RequestMapping("/ems")
 *   - All URLs in this controller start with /ems
 */
@RestController
@RequestMapping("/ems")
public class EmployeeController {

    // Dependency
    private final EmployeeService employeeService;

    // Constructor Injection
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Search Employees
    // GET /ems/search
    /**
     * Search employees with optional filters
     *
     * All @RequestParam are optional (required = false)
     * If not provided -> they will be null
     * Service handles the null case (returns all employees)
     *
     * URL Examples:
     * GET /ems/search
     * GET /ems/search?name=Rahul
     * GET /ems/search?age=28
     * GET /ems/search?department=IT
     * GET /ems/search?name=Rahul&department=IT
     * GET /ems/search?age=28&department=IT
     * GET /ems/search?name=Rahul&age=28&department=IT
     *
     * @RequestParam(required = false) means:
     * - This parameter is NOT mandatory in the URL
     * - If missing, it will be null
     */
    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer age,
            @RequestParam(required = false) String department) {

        // Controller just passes to service for logic.
        List<Employee> employees = employeeService.searchEmployees(name, age, department);

        // Return 200 OK with the list
        return ResponseEntity.ok(employees);
    }
}
