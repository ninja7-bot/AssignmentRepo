package com.training.todo.service;

import com.training.todo.client.NotificationClient;
import com.training.todo.dto.TaskDTO;
import com.training.todo.entity.Tasks;
import com.training.todo.enums.TodoStatus;
import com.training.todo.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private NotificationClient notificationClient;

    @InjectMocks
    private TaskService taskService;

    private Tasks sampleTask;
    private TaskDTO sampleTaskDTO;

    @BeforeEach
    void setUp() {
        sampleTask = new Tasks();
        sampleTask.setId(1L);
        sampleTask.setTitle("Buy groceries");
        sampleTask.setDescription("Milk and eggs");
        sampleTask.setStatus(TodoStatus.PENDING);
        sampleTask.setCreatedAt(LocalDateTime.now());

        sampleTaskDTO = new TaskDTO();
        sampleTaskDTO.setTitle("Buy groceries");
        sampleTaskDTO.setDescription("Milk and eggs");
        sampleTaskDTO.setStatus(TodoStatus.PENDING);
    }

    @Test
    void testCreateTask() {
        when(taskRepository.save(any(Tasks.class))).thenReturn(sampleTask);

        Map<String, Object> result = taskService.createTask(sampleTaskDTO);

        assertNotNull(result);
        assertEquals("Buy groceries", result.get("title"));
        assertEquals(TodoStatus.PENDING, result.get("status"));
        verify(notificationClient, times(1)).notifyTaskCreated("Buy groceries");
    }

    @Test
    void testGetAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(sampleTask));

        List<Map<String, Object>> result = taskService.getAllTasks();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Buy groceries", result.get(0).get("title"));
    }

    @Test
    void testGetTaskById() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));

        Map<String, Object> result = taskService.getTaskById(1L);

        assertNotNull(result);
        assertEquals(1L, result.get("id"));
        assertEquals("Buy groceries", result.get("title"));
    }

    @Test
    void testGetTaskByIdNotFound() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> taskService.getTaskById(999L));
    }

    @Test
    void testUpdateTask() {
        Tasks completedTask = new Tasks();
        completedTask.setId(1L);
        completedTask.setTitle("Buy groceries");
        completedTask.setStatus(TodoStatus.COMPLETED);
        completedTask.setCreatedAt(LocalDateTime.now());

        TaskDTO updateDTO = new TaskDTO();
        updateDTO.setTitle("Buy groceries");
        updateDTO.setStatus(TodoStatus.COMPLETED);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Tasks.class))).thenReturn(completedTask);

        Map<String, Object> result = taskService.updateTask(1L, updateDTO);

        assertNotNull(result);
        assertEquals(TodoStatus.COMPLETED, result.get("status"));
    }

    @Test
    void testUpdateTaskInvalidTransition() {
        TaskDTO updateDTO = new TaskDTO();
        updateDTO.setTitle("Buy groceries");
        updateDTO.setStatus(TodoStatus.PENDING);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));

        assertThrows(RuntimeException.class, () -> taskService.updateTask(1L, updateDTO));
    }

    @Test
    void testUpdateTaskTaskNotFound() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> taskService.updateTask(999L, sampleTaskDTO));
    }

    @Test
    void testDeleteTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        doNothing().when(taskRepository).deleteById(1L);

        String result = taskService.deleteTask(1L);

        assertNotNull(result);
        assertTrue(result.contains("deleted"));
        verify(taskRepository, times(1)).deleteById(1L);
        verify(notificationClient, times(1)).notifyTaskDeleted("Buy groceries");
    }

    @Test
    void testDeleteTaskNotFound() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> taskService.deleteTask(999L));
        verify(taskRepository, never()).deleteById(any());
    }

    @Test
    void testDeleteAllTasksConfirmed() {
        when(taskRepository.count()).thenReturn(3L);
        doNothing().when(taskRepository).deleteAll();

        String result = taskService.deleteAllTasks(true);

        assertTrue(result.contains("3"));
        verify(taskRepository, times(1)).deleteAll();
    }

    @Test
    void testDeleteAllTasksUnconfirmed() {
        String result = taskService.deleteAllTasks(false);

        assertTrue(result.contains("Confirmation required"));
        verify(taskRepository, never()).deleteAll();
    }

    @Test
    void testDeleteAllTasksNoTasksExist() {
        when(taskRepository.count()).thenReturn(0L);

        String result = taskService.deleteAllTasks(true);

        assertTrue(result.contains("No tasks"));
        verify(taskRepository, never()).deleteAll();
    }
}