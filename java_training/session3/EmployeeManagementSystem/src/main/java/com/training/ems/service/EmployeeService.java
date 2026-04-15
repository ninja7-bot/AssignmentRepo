package com.training.ems.service;

import com.training.ems.model.Employee;
import com.training.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * EmployeeService - Business Logic Layer
 * 
 * EmployeeService manages the logic for:
 * - Employee Search
 * - Add New Employee
 * - Delete Employee
 */
@Service
public class EmployeeService {
    
    // Dependency
    // final = this reference will never change after initialization
    private final EmployeeRepository employeeRepository;

    // Constructor Injection
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    
    // Search Employees
    /**
     * Search employees using optional filters
     * Logic:
     * - If NO filters provided -> returns all employees
     * - If filters provided -> return employees matching all given filters
     * - name matching: case-insensitive, partial match
     *   "rah" will find "Rahul Sharma"
     * - age matching: exact match only
     *   28 will only find employees aged exactly 28
     * - department matching: case-insensitive, exact match
     *   "it" will find "IT"
     */
    public List<Employee> searchEmployees(String name, Integer age, String department) {

        // Get all employees from repository
        List<Employee> allEmployees = employeeRepository.findAll();

        // If no filters given, return all employees
        if (name == null && age == null && department == null) {
            System.out.println("No filters provided. Returning all employees.");
            return allEmployees;
        }

        // Start with all employees and narrow down
        List<Employee> filtered = new ArrayList<>(allEmployees);

        // Filter by name -> case-insensitive, partial match
        if (name != null && !name.trim().isEmpty()) {
            filtered = filtered.stream()
                    .filter(emp -> emp.getName()
                            .toLowerCase()
                            .contains(name.toLowerCase().trim()))
                    .collect(Collectors.toList());

            System.out.println("After name filter '" + name
                    + "': " + filtered.size() + " result(s)");
        }

        // Filter by age -> exact match only
        if (age != null) {
            filtered = filtered.stream()
                    .filter(emp -> emp.getAge() != null
                            && emp.getAge().equals(age))
                    .collect(Collectors.toList());

            System.out.println("After age filter '" + age
                    + "': " + filtered.size() + " result(s)");
        }

        // Filter by department -> case-insensitive, exact match
        if (department != null && !department.trim().isEmpty()) {
            filtered = filtered.stream()
                    .filter(emp -> emp.getDepartment()
                            .toLowerCase()
                            .equals(department.toLowerCase().trim()))
                    .collect(Collectors.toList());

            System.out.println("After department filter '" + department
                    + "': " + filtered.size() + " result(s)");
        }

        return filtered;
    }
}