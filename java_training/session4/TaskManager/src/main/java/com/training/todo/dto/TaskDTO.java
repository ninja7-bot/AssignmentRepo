package com.training.todo.dto;

import com.training.todo.enums.TodoStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * TaskDTO - Data Transfer Object
 *
 * The details received from User End are title, description and status.
 *
 * The rest values are set from backend:
 * -> id is auto-generated
 * -> createdAt is set by the system.
 */
public class TaskDTO {

    /**
     * Title of the task
     * REQUIRED, minimum 3 characters
     */
    @NotBlank(message = "Title is required and cannot be empty")
    @Size(min = 3, message = "Title must be at least 3 characters long")
    private String title;

    /**
     * Description [optional]
     * Max 255 characters
     */
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    /**
     * Status [optional]
     * If not provided then defaults to PENDING in service
     * Can be: UPCOMING, PENDING, COMPLETED
     */
    private TodoStatus status;


    // CONSTRUCTORS
    public TaskDTO() {
    }

    public TaskDTO(String title, String description, TodoStatus status) {
        this.title = title;
        this.description = description;
        this.status = status;
    }


    // GETTERS
    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TodoStatus getStatus() {
        return status;
    }


    // SETTERS
    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(TodoStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "TaskDTO{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status=" + status +
                '}';
    }
}