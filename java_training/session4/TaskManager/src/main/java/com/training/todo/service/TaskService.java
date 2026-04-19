package com.training.todo.service;

import com.training.todo.dto.TaskDTO;
import com.training.todo.entity.Tasks;
import com.training.todo.enums.TodoStatus;
import com.training.todo.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * TaskService - Business Logic Layer
 *
 * Handles all task operations:
 * -> Create, Read, Update, Delete
 * -> DTO to Entity conversion (manual)
 * -> Status transition validation
 */
@Service
public class TaskService {

    private final TaskRepository taskRepository;

    // Constructor Injection
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }


    // Convert DTO to ENTITY: TaskDTO -> Task Entity
    /**
     * Convert TaskDTO to Task Entity
     * Before saving to database
     * Sets default status and createdAt automatically
     */
    private Tasks convertToEntity(TaskDTO taskDTO) {
        Tasks task = new Tasks();

        task.setTitle(taskDTO.getTitle().trim());
        task.setDescription(taskDTO.getDescription());

        // Defaults to PENDING if status is not provided
        if (taskDTO.getStatus() != null) {
            task.setStatus(taskDTO.getStatus());
        } else {
            task.setStatus(TodoStatus.PENDING);
        }

        // System sets createdAt
        task.setCreatedAt(LocalDateTime.now());

        return task;
    }


    // CONVERT ENTITY TO RESPONSE MAP: Task Entity -> Response Map
    /**
     * Convert Task Entity to Response Map
     * Called before sending data to client
     * LinkedHashMap maintains field order in JSON
     */
    private Map<String, Object> convertToResponseMap(Tasks task) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", task.getId());
        response.put("title", task.getTitle());
        response.put("description", task.getDescription());
        response.put("status", task.getStatus());
        response.put("createdAt", task.getCreatedAt());
        return response;
    }


    // Validate Status Transition
    /**
     * Validate if the status transition is allowed
     *
     * Allowed:
     * UPCOMING  -> PENDING
     * PENDING   -> COMPLETED
     * COMPLETED -> PENDING
     *
     * Not Allowed:
     * UPCOMING  -> COMPLETED
     * PENDING   -> UPCOMING
     * COMPLETED -> UPCOMING
     * Same      -> Same
     */
    private void validateStatusTransition(
            TodoStatus currentStatus, TodoStatus newStatus) {

        // Same status check
        if (currentStatus == newStatus) {
            throw new RuntimeException(
                    "Invalid transition: Task is already " + currentStatus
            );
        }

        // UPCOMING can only go to PENDING
        if (currentStatus == TodoStatus.UPCOMING
                && newStatus == TodoStatus.COMPLETED) {
            throw new RuntimeException(
                    "Invalid transition: UPCOMING -> COMPLETED is not allowed. "
                            + "Task must be PENDING before COMPLETED."
            );
        }

        // PENDING cannot go back to UPCOMING
        if (currentStatus == TodoStatus.PENDING
                && newStatus == TodoStatus.UPCOMING) {
            throw new RuntimeException(
                    "Invalid transition: PENDING -> UPCOMING is not allowed. "
                            + "An active task cannot go back to upcoming."
            );
        }

        // COMPLETED cannot go back to UPCOMING
        if (currentStatus == TodoStatus.COMPLETED
                && newStatus == TodoStatus.UPCOMING) {
            throw new RuntimeException(
                    "Invalid transition: COMPLETED -> UPCOMING is not allowed. "
                            + "Use COMPLETED -> PENDING to reopen a task."
            );
        }
    }


    // FEATURE 1: CREATE TASK
    /**
     * Create a new task
     * Automatically sets: id, createdAt
     * Defaults status to PENDING if not provided
     */
    public Map<String, Object> createTask(TaskDTO taskDTO) {
        Tasks task = convertToEntity(taskDTO);
        Tasks savedTask = taskRepository.save(task);

        System.out.println("✅ Task CREATED -> ID: " + savedTask.getId()
                + " | " + savedTask.getTitle()
                + " | " + savedTask.getStatus());

        return convertToResponseMap(savedTask);
    }


    // FEATURE 2: GET ALL TASKS
    /**
     * Get all tasks from database
     */
    public List<Map<String, Object>> getAllTasks() {
        List<Tasks> allTasks = taskRepository.findAll();

        System.out.println("📋 Fetched " + allTasks.size() + " tasks");

        return allTasks.stream()
                .map(this::convertToResponseMap)
                .collect(Collectors.toList());
    }
}