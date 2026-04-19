# TASK MANAGER
Task Manager is basically a to-do list app built with Spring Boot and uses H2 Database as an in-memory database.

The app operates using JPA, H2 and Spring Boot. The H2 Database acts as a dummy database, wherein the memory resets 
after every restart.

---

## Tech Stack
- Java 17 | Spring Boot | Maven
- Spring Data JPA + Hibernate
- H2 In-Memory Database
- Bean Validation (@Valid)

---

## Running The App
- API: `http://localhost:8080/tasks`
- H2 Console: `http://localhost:8080/h2-console`
    - JDBC URL: `jdbc:h2:mem:tododb` | Username: `su` | Password: *(blank)*

---

## APIs

| Method | URL           | Description      |
|--------|---------------|------------------|
| POST | `/tasks`      | Create task      |
| GET | `/tasks`      | Get all tasks    |
| GET | `/tasks/{id}` | Get by ID        |
| PUT | `/tasks/{id}` | Update task      |
| DELETE | `/tasks/{id}` | Delete task      |
| DELETE | `/tasks/`     | Delete ALL tasks |

---

## Validations
| Field | Rule                             |
|-------|----------------------------------|
| title | Required, min 3 characters       |
| description | Optional, max 255 characters     |
| status | UPCOMING or PENDING or COMPLETED |

## Status Transitions
- UPCOMING -> PENDING
- PENDING -> COMPLETED 
- COMPLETED -> PENDING
