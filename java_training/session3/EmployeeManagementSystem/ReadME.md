# Employee Management System - Spring Boot

A REST API project for managing employee records built with Spring Boot.

---

## Tech Stack
- Java 17
- Spring Boot
- Maven

Application starts at: `http://localhost:8080`

---

## API Endpoints

### Search Employees
```
GET /employees/search
```
| Parameter  | Type    | Required | Description              |
|------------|---------|----------|--------------------------|
| name       | String  | No       | Case-insensitive search  |
| age        | Integer | No       | Exact match              |
| department | String  | No       | Case-insensitive search  |

**Examples:**
```
/employees/search                       → All employees
/employees/search?name=Rahul           → Search by name
/employees/search?age=28               → Search by age
/employees/search?department=IT        → Search by department
/employees/search?age=28&department=IT → Multiple filters
```

---

### Add Employee
```
POST /employees/add
```
**Request Body:**
```json
{
  "name": "John Doe",
  "age": 27,
  "department": "IT",
  "designation": "Developer",
  "salary": 70000
}
```
**Responses:**
- `201` → Employee added successfully
- `400` → Validation failed

---

### Delete Employee
```
DELETE /employees/{id}?confirm=true
```
- No confirm → `"Confirmation required"`
- `confirm=true` → Employee deleted
- Not found → `404 error`

---

## Pre-loaded Employees

| ID | Name          | Age | Department | Designation         |
|----|---------------|-----|------------|---------------------|
| 1  | Rahul Sharma  | 28  | IT         | Software Developer  |
| 2  | Priya Patel   | 32  | HR         | HR Manager          |
| 3  | Amit Kumar    | 25  | IT         | Junior Developer    |
| 4  | Sneha Reddy   | 35  | Finance    | Finance Analyst     |
| 5  | Vikram Singh  | 40  | IT         | Tech Lead           |
| 6  | Anjali Gupta  | 29  | Marketing  | Marketing Executive |
| 7  | Rohit Verma   | 38  | Finance    | Finance Manager     |

---

## Project Structure
```
src/main/java/com/training/employee/
├── EmployeeManagementApplication.java
├── model/Employee.java
├── repository/EmployeeRepository.java
├── service/EmployeeService.java
└── controller/
    ├── EmployeeController.java
    └── GlobalExceptionHandler.java
```

---

## Features
- Constructor-based Dependency Injection
- Layered Architecture (Controller → Service → Repository)
- Search with multiple optional filters
- Input validation on employee creation
- Confirmation-based deletion
- Centralized exception handling
- In-memory data storage

---
