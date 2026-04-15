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

    // Add New Employee
    /**
     * Add a new employee to the system with validation
     *
     * Validation Rules:
     * 1. Name is required and cannot be empty
     * 2. Age is required, must be between 18 and 65
     * 3. Department is required and cannot be empty
     * 4. Designation is required and cannot be empty
     * 5. Salary is required, must be greater than 0
     */
    public Employee addEmployee(Employee employee) {

        // Name is required
        if (employee.getName() == null || employee.getName().trim().isEmpty()) {
            throw new RuntimeException("Employee name is required");
        }

        // Age is required
        if (employee.getAge() == null) {
            throw new RuntimeException("Employee age is required");
        }

        // Age must be within working range
        if (employee.getAge() < 18 || employee.getAge() > 65) {
            throw new RuntimeException(
                    "Employee age must be between 18 and 65. Provided: "
                            + employee.getAge()
            );
        }

        // Department is required
        if (employee.getDepartment() == null || employee.getDepartment().trim().isEmpty()) {
            throw new RuntimeException("Department is required");
        }

        // Designation is required
        if (employee.getDesignation() == null || employee.getDesignation().trim().isEmpty()) {
            throw new RuntimeException("Designation is required");
        }

        // Salary is required
        if (employee.getSalary() == null) {
            throw new RuntimeException("Salary is required");
        }

        // Salary must be positive
        if (employee.getSalary() <= 0) {
            throw new RuntimeException(
                    "Salary must be greater than 0. Provided: "
                            + employee.getSalary()
            );
        }

        // Save the employee
        Employee savedEmployee = employeeRepository.save(employee);
        System.out.println("New employee added: " + savedEmployee.getName()
                + " | Department: " + savedEmployee.getDepartment());

        return savedEmployee;
    }

    // Delete Employee with Confirmation
    /**
     * Delete an employee from the system with confirmation check
     *
     * Logic:
     * - If confirm is false or not provided -> do not delete
     *   Return: "Confirmation required to delete this employee"
     * - If confirm is true -> proceed with deletion
     * - Employee must exist
     */
    public String deleteEmployee(Long id, boolean confirm) {

        // Check if employee exists first
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with ID: " + id);
        }

        // Check confirmation
        if (!confirm) {
            // Do not delete - return a message asking for confirmation
            return "Confirmation required. "
                    + "Please send ?confirm=true to delete employee with ID: " + id;
        }

        // Confirmed - proceed with deletion
        employeeRepository.deleteById(id);
        System.out.println("Employee deleted with ID: " + id);

        return "Employee with ID " + id + " has been successfully deleted.";
    }
}