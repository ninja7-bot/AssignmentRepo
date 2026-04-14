package com.training.ems.repository;

import com.training.ems.model.Employee;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * EmployeeRepository - Data Access Layer
 *
 * This class acts as in-memory storage and performing actions over the data:
 * - Getting all employees
 * - Finding a specific employee
 * - Adding a new employee
 * - Removing an employee
 * - Checking if an employee exists
 *
 */
@Repository
public class EmployeeRepository {
    // In-memory storage (acts as database)
    // ArrayList stores all employees in memory
    private final List<Employee> employeeList = new ArrayList<>();

    // Auto-increment counter for unique IDs
    private Long nextId = 1L;

    // Constructor - loads dummy data
    /**
     * When Spring creates this repository,
     * this constructor runs and loads 7 dummy employees.
     */
    public EmployeeRepository() {

        employeeList.add(new Employee(
                nextId++,
                "Rahul Sharma",
                28,
                "IT",
                "Software Developer",
                75000.00
        ));

        employeeList.add(new Employee(
                nextId++,
                "Priya Patel",
                32,
                "HR",
                "HR Manager",
                30000.00
        ));

        employeeList.add(new Employee(
                nextId++,
                "Amit Kumar",
                25,
                "IT",
                "Junior Developer",
                55000.00
        ));

        employeeList.add(new Employee(
                nextId++,
                "Sneha Reddy",
                35,
                "Finance",
                "Finance Analyst",
                90000.00
        ));

        employeeList.add(new Employee(
                nextId++,
                "Vikram Singh",
                40,
                "IT",
                "Tech Lead",
                120000.00
        ));

        employeeList.add(new Employee(
                nextId++,
                "Anjali Gupta",
                29,
                "Marketing",
                "Marketing Executive",
                40000.00
        ));

        employeeList.add(new Employee(
                nextId++,
                "Rohit Verma",
                38,
                "Finance",
                "Finance Manager",
                110000.00
        ));

        System.out.println("EmployeeRepository: Loaded "
                + employeeList.size() + " employees.");
    }

    // Data Operations

    /**
     * Get ALL employees
     * Returns a copy to prevent accidental modification of original list
     */
    public List<Employee> findAll() {
        return new ArrayList<>(employeeList);
    }

    /**
     * Find the employee by ID
     */
    public Optional<Employee> findById(Long id) {
        for (Employee employee : employeeList) {
            if (employee.getId().equals(id)) {
                return Optional.of(employee);
            }
        }
        return Optional.empty();
    }

    /**
     * Save the NEW employee to the list
     * Assigns a unique ID automatically before saving
     */
    public Employee save(Employee employee) {
        employee.setId(nextId++);
        employeeList.add(employee);
        return employee;
    }

    /**
     * Delete an employee by ID
     * removeIf removes the employee if condition matches
     * Returns true if deleted, false if not found
     */
    public boolean deleteById(Long id) {
        return employeeList.removeIf(employee -> employee.getId().equals(id));
    }

    /**
     * Check if an employee exists by ID
     * Used before deleting to confirm existence
     */
    public boolean existsById(Long id) {
        for (Employee employee : employeeList) {
            if (employee.getId().equals(id)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if an employee with the same name already exists
     * Used to prevent duplicate entries
     */
    public boolean existsByName(String name) {
        for (Employee employee : employeeList) {
            if (employee.getName().equalsIgnoreCase(name)) {
                return true;
            }
        }
        return false;
    }
}