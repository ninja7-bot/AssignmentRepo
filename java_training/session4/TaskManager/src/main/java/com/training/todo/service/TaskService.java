package com.training.todo.service;

import com.training.todo.dto.TaskDTO;
import com.training.todo.entity.Tasks;
import com.training.todo.enums.TodoStatus;
import com.training.todo.repository.TaskRepository;
import com.training.todo.client.NotificationClient;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    private static final Logger log = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final NotificationClient notificationClient;

    // Constructor Injection
    public TaskService(TaskRepository taskRepository,
                       NotificationClient notificationClient) {
        this.taskRepository = taskRepository;
        this.notificationClient = notificationClient;
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
            log.warn("Invalid transition attempted: {} -> {} (same status)",
                    currentStatus, newStatus);
            throw new RuntimeException(
                    "Invalid transition: Task is already " + currentStatus
            );
        }

        // UPCOMING can only go to PENDING
        if (currentStatus == TodoStatus.UPCOMING
                && newStatus == TodoStatus.COMPLETED) {
            log.warn("Invalid transition attempted: UPCOMING -> COMPLETED");
            throw new RuntimeException(
                    "Invalid transition: UPCOMING -> COMPLETED is not allowed. "
                            + "Task must be PENDING before COMPLETED."
            );
        }

        // PENDING cannot go back to UPCOMING
        if (currentStatus == TodoStatus.PENDING
                && newStatus == TodoStatus.UPCOMING) {
            log.warn("Invalid transition attempted: PENDING -> UPCOMING");
            throw new RuntimeException(
                    "Invalid transition: PENDING -> UPCOMING is not allowed. "
                            + "An active task cannot go back to upcoming."
            );
        }

        // COMPLETED cannot go back to UPCOMING
        if (currentStatus == TodoStatus.COMPLETED
                && newStatus == TodoStatus.UPCOMING) {
            log.warn("Invalid transition attempted: COMPLETED -> UPCOMING");
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
        log.info("Creating new task with title: '{}'", taskDTO.getTitle());
        Tasks task = convertToEntity(taskDTO);
        Tasks savedTask = taskRepository.save(task);

        log.info("Task created successfully -> ID: {}, Title: '{}', Status: {}",
                savedTask.getId(), savedTask.getTitle(), savedTask.getStatus());

        // Notify if Task Created
        notificationClient.notifyTaskCreated(savedTask.getTitle());

        return convertToResponseMap(savedTask);
    }


    // FEATURE 2: GET ALL TASKS
    /**
     * Get all tasks from database
     */
    public List<Map<String, Object>> getAllTasks() {
        log.info("Fetching all tasks");
        List<Tasks> allTasks = taskRepository.findAll();

        if (allTasks.isEmpty()) {
            log.warn("No tasks found in the database");
        } else {
            log.info("Fetched {} task(s) successfully", allTasks.size());
        }

        return allTasks.stream()
                .map(this::convertToResponseMap)
                .collect(Collectors.toList());
    }


    // FEATURE 3: GET TASK BY ID
    /**
     * Get a single task by ID
     * Throws error if not found
     */
    public Map<String, Object> getTaskById(Long id) {
        log.info("Fetching task with ID: {}", id);
        
        Tasks task = taskRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Task not found with ID: {}", id);
                    return new RuntimeException(
                            "Task not found with ID: " + id
                    );
                });

        log.info("Task found -> ID: {}, Title: '{}'", id, task.getTitle());

        return convertToResponseMap(task);
    }


    // FEATURE 4: UPDATE TASK
    /**
     * Update an existing task
     *
     * Can update: title, description, status
     * Cannot update: id, createdAt
     */
    public Map<String, Object> updateTask(Long id, TaskDTO taskDTO) {
        log.info("Updating task with ID: {}", id);

        // Find existing task
        Tasks existingTask = taskRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Task not found with ID: {} (update failed)", id);
                    return new RuntimeException(
                            "Task not found with ID: " + id
                    );
                });

        log.debug("Current task state -> Title: '{}', Status: {}",
                existingTask.getTitle(), existingTask.getStatus());

        // Update title if provided
        if (taskDTO.getTitle() != null
                && !taskDTO.getTitle().trim().isEmpty()) {
            existingTask.setTitle(taskDTO.getTitle().trim());
        }

        // Update description if provided
        if (taskDTO.getDescription() != null) {
            existingTask.setDescription(taskDTO.getDescription());
        }

        // Update status with transition validation
        if (taskDTO.getStatus() != null) {
            validateStatusTransition(
                    existingTask.getStatus(),
                    taskDTO.getStatus()
            );
            existingTask.setStatus(taskDTO.getStatus());

            // Notify if task is completed
            if (taskDTO.getStatus() == TodoStatus.COMPLETED) {
                notificationClient
                        .notifyTaskCompleted(existingTask.getTitle());
            }
        }

        // Save updated task
        Tasks updatedTask = taskRepository.save(existingTask);

        log.info("Task updated successfully -> ID: {}, Status: {}",
                updatedTask.getId(), updatedTask.getStatus());

        return convertToResponseMap(updatedTask);
    }


    // FEATURE 5: DELETE TASK
    /**
     * Delete a task by ID
     * Throws error if not found
     */
    public String deleteTask(Long id) {
        log.info("Deleting task with ID: {}", id);

        Tasks task = taskRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Task not found with ID: {} (delete failed)", id);
                    return new RuntimeException(
                            "Task not found with ID: " + id
                    );
                });

        taskRepository.deleteById(id);

        log.info("Task deleted -> ID: {}, Title: '{}'", id, task.getTitle());

        // Notify if Task Deleted
        notificationClient.notifyTaskDeleted(task.getTitle());

        return "Task '" + task.getTitle()
                + "' (ID: " + id + ") deleted successfully.";
    }


    // FEATURE 6: DELETE ALL TASKS
    /**
     * Delete all tasks.
     *
     * Requires confirmation with ?confirm=true
     * Defaults to false.
     */
    public String deleteAllTasks(boolean confirm) {
        log.info("Delete all tasks requested. Confirm: {}", confirm);

        // Check confirmation first
        if (!confirm) {
            log.warn("Delete all attempted without confirmation");
            return "Confirmation required. "
                    + "Send ?confirm=true to delete ALL tasks. "
                    + "Warning: This action cannot be undone!";
        }

        // Check if there is anything to delete
        long totalTasks = taskRepository.count();

        if (totalTasks == 0) {
            log.warn("Delete all called but no tasks exist");
            return "No tasks found. Nothing to delete.";
        }

        // Confirmed - delete everything
        taskRepository.deleteAll();

        log.info("ALL tasks deleted. Total deleted: {}", totalTasks);

        return "All " + totalTasks + " task(s) have been successfully deleted.";
    }
}