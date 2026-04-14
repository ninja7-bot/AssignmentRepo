package com.training.ems.model;

/**
 * Employee Model Class
 *
 * It represents what an Employee looks like in our system
 *
 *The Employee Data Container consists of values like:
 *      ID: Long
 *      Name: String
 *      Age: Int
 *      Department: String
 *      Designation: String
 *      Salary: Double
 *
 * This is just a data container
 */

public class Employee {

    // Employee Details.
    private Long id;
    private String name;
    private Integer age;
    private String department;
    private String designation;
    private Double salary;

    // Constructors
    // Default constructor
    public Employee() {
    }

    // Full constructor
    public Employee(Long id, String name, Integer age,
                    String department, String designation, Double salary) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.department = department;
        this.designation = designation;
        this.salary = salary;
    }

    // Getters - Reading values from the object
    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public Integer getAge() {
        return age;
    }
    public String getDepartment() {
        return department;
    }
    public String getDesignation() {
        return designation;
    }
    public Double getSalary() {
        return salary;
    }

    // Setters - Setting values to the object

    public void setId(Long id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setAge(Integer age) {
        this.age = age;
    }
    public void setDepartment(String department) {
        this.department = department;
    }
    public void setDesignation(String designation) {
        this.designation = designation;
    }
    public void setSalary(Double salary) {
        this.salary = salary;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", department='" + department + '\'' +
                ", designation='" + designation + '\'' +
                ", salary=" + salary +
                '}';
    }
}