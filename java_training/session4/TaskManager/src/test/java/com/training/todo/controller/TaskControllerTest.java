package com.training.todo.controller;

import com.training.todo.dto.TaskDTO;
import com.training.todo.enums.TodoStatus;
import com.training.todo.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    private Map<String, Object> sampleResponse;
    private TaskDTO sampleTaskDTO;

    @BeforeEach
    void setUp() {
        sampleResponse = new LinkedHashMap<>();
        sampleResponse.put("id", 1L);
        sampleResponse.put("title", "Buy groceries");
        sampleResponse.put("status", TodoStatus.PENDING);

        sampleTaskDTO = new TaskDTO();
        sampleTaskDTO.setTitle("Buy groceries");
        sampleTaskDTO.setDescription("Milk and eggs");
    }

    @Test
    void testCreateTask() {
        when(taskService.createTask(any(TaskDTO.class))).thenReturn(sampleResponse);

        var result = taskController.createTask(sampleTaskDTO);

        assertNotNull(result);
        assertNotNull(result.getBody());
        assertEquals("Buy groceries", result.getBody().get("title"));
        verify(taskService, times(1)).createTask(any(TaskDTO.class));
    }

    @Test
    void testGetAllTasks() {
        when(taskService.getAllTasks()).thenReturn(List.of(sampleResponse));

        var result = taskController.getAllTasks();

        assertNotNull(result);
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().size());
        verify(taskService, times(1)).getAllTasks();
    }

    @Test
    void testGetTaskById() {
        when(taskService.getTaskById(1L)).thenReturn(sampleResponse);

        var result = taskController.getTaskById(1L);

        assertNotNull(result);
        assertNotNull(result.getBody());
        assertEquals(1L, result.getBody().get("id"));
        verify(taskService, times(1)).getTaskById(1L);
    }

    @Test
    void testGetTaskByIdNotFound() {
        when(taskService.getTaskById(999L))
                .thenThrow(new RuntimeException("Task not found with ID: 999"));

        assertThrows(RuntimeException.class, () -> taskController.getTaskById(999L));
    }

    @Test
    void testUpdateTask() {
        Map<String, Object> updatedResponse = new LinkedHashMap<>();
        updatedResponse.put("id", 1L);
        updatedResponse.put("title", "Buy groceries");
        updatedResponse.put("status", TodoStatus.COMPLETED);

        when(taskService.updateTask(eq(1L), any(TaskDTO.class)))
                .thenReturn(updatedResponse);

        TaskDTO updateDTO = new TaskDTO();
        updateDTO.setTitle("Buy groceries");
        updateDTO.setStatus(TodoStatus.COMPLETED);

        var result = taskController.updateTask(1L, updateDTO);

        assertNotNull(result);
        assertNotNull(result.getBody());
        assertEquals(TodoStatus.COMPLETED, result.getBody().get("status"));
        verify(taskService, times(1)).updateTask(eq(1L), any(TaskDTO.class));
    }

    @Test
    void testDeleteTask() {
        when(taskService.deleteTask(1L))
                .thenReturn("Task 'Buy groceries' (ID: 1) deleted successfully.");

        var result = taskController.deleteTask(1L);

        assertNotNull(result);
        assertNotNull(result.getBody());
        assertTrue(result.getBody().get("message").contains("deleted"));
        verify(taskService, times(1)).deleteTask(1L);
    }

    @Test
    void testDeleteAllTasksUnconfirmed() {
        when(taskService.deleteAllTasks(false))
                .thenReturn("Confirmation required.");

        var result = taskController.deleteAllTasks(false);

        assertNotNull(result);
        assertNotNull(result.getBody());
        assertTrue(result.getBody().get("message").contains("Confirmation required"));
        verify(taskService, times(1)).deleteAllTasks(false);
    }

    @Test
    void testDeleteAllTasksConfirmed() {
        when(taskService.deleteAllTasks(true))
                .thenReturn("All 3 task(s) have been successfully deleted.");

        var result = taskController.deleteAllTasks(true);

        assertNotNull(result);
        assertNotNull(result.getBody());
        assertTrue(result.getBody().get("message").contains("3"));
        verify(taskService, times(1)).deleteAllTasks(true);
    }
}