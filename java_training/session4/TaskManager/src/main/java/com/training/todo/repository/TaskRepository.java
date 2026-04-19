package com.training.todo.repository;

import com.training.todo.entity.Tasks;
import com.training.todo.enums.TodoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * TaskRepository - Data Access Layer
 *
 * Extends JpaRepository<Task, Long>
 * Tasks is the entity to manage
 * Long is the type of primary key
 *
 * Available methods from JpaRepository:
 * save(), findById(), findAll(), deleteById(), existsById()
 */
@Repository
public interface TaskRepository extends JpaRepository<Tasks, Long> {

    /**
     * Find tasks by status
     * SQL Example: SELECT * FROM tasks WHERE status = ""
     */
    List<Tasks> findByStatus(TodoStatus status);

    /**
     * Find tasks by title keyword
     * SQL Example: WHERE LOWER(title) LIKE LOWER('%keyword%')
     */
    List<Tasks> findByTitleContainingIgnoreCase(String keyword);
}
