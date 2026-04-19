package com.training.todo.controller;

import com.training.todo.dto.TaskDTO;
import com.training.todo.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * TaskController - REST API Layer
 *
 * Endpoints:
 * POST   /tasks       → Create task
 * GET    /tasks       → Get all tasks
 * GET    /tasks/{id}  → Get task by ID
 * PUT    /tasks/{id}  → Update task
 * DELETE /tasks/{id}  → Delete task
 *
 * Only receives requests and returns responses
 */
@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    // Constructor Injection
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    // API 1: CREATE TASK
    // POST /tasks
    /**
     * Create a new task
     * @Valid triggers validation from TaskDTO
     * Returns 201 Created on success
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTask(
            @Valid @RequestBody TaskDTO taskDTO) {

        Map<String, Object> createdTask = taskService.createTask(taskDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }


    // API 2: GET ALL TASKS
    // GET /tasks
    /**
     * Get all tasks
     * Returns empty list if no tasks exist
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllTasks() {

        List<Map<String, Object>> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }


    // API 3: GET TASK BY ID
    // GET /tasks/{id}
    /**
     * Get a single task by ID
     * Returns 400 if task not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTaskById(
            @PathVariable Long id) {

        Map<String, Object> task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }


    // API 4: UPDATE TASK
    // PUT /tasks/{id}
    /**
     * Update an existing task
     * @Valid validates incoming TaskDTO
     * Returns updated task on success
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskDTO taskDTO) {

        Map<String, Object> updatedTask = taskService.updateTask(id, taskDTO);
        return ResponseEntity.ok(updatedTask);
    }


    // API 5: DELETE TASK
    // DELETE /tasks/{id}
    /**
     * Delete a task by ID
     * Returns success message on deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(
            @PathVariable Long id) {

        String message = taskService.deleteTask(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", message);

        return ResponseEntity.ok(response);
    }


    // API 6: DELETE ALL TASKS
    // DELETE /tasks

    /**
     * Delete ALL tasks.
     *
     * NON-REVERSIBLE
     * Returns success message on completion.
     */
    @DeleteMapping
    public ResponseEntity<Map<String, String>> deleteAllTasks(
            @RequestParam(required = false, defaultValue = "false") boolean confirm) {

        String message = taskService.deleteAllTasks(confirm);

        Map<String, String> response = new HashMap<>();
        response.put("message", message);

        return ResponseEntity.ok(response);
    }
}