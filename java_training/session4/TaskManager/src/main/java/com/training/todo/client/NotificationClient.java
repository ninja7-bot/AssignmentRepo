package com.training.todo.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Dummy NotificationClient to mimic client response.
 */
@Component
public class NotificationClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);

    /**
     * Dummy notification simulating Task Created
     * @param taskTitle
     */
    public void notifyTaskCreated(String taskTitle) {
        log.info("Action: TASK CREATED");
        log.info("Task: {}", taskTitle);
        log.info("Message: New task: '{}'", taskTitle);
        log.info("Status: SUCCESS");
    }

    /**
     * Dummy notification simulating Task Completed
     * @param taskTitle
     */
    public void notifyTaskCompleted(String taskTitle) {
        log.info("Action: TASK COMPLETED");
        log.info("Task: {}", taskTitle);
        log.info("Message: Task '{}' has been completed!", taskTitle);
        log.info("Status: SUCCESS");
    }

    /**
     * Dummy notification simulating Task Deleted
     * @param taskTitle
     */
    public void notifyTaskDeleted(String taskTitle) {
        log.warn("Action: TASK DELETED");
        log.warn("Task: {}", taskTitle);
        log.warn("Message: Task '{}' has been deleted.", taskTitle);
        log.warn("Status: SUCCESS");
    }
}