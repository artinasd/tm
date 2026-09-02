package com.task_service.task_service.config;

import com.task_service.task_service.entity.TaskStatusType;
import com.task_service.task_service.repository.TaskStatusTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class TaskStatusDataInitializer {

    private static final List<String> DEFAULT_STATUSES = List.of("created", "ongoing");

    @Bean
    CommandLineRunner initializeTaskStatuses(TaskStatusTypeRepository repository) {
        return args -> {
            for (String status : DEFAULT_STATUSES) {
                if (repository.findByType(status) == null) {
                    TaskStatusType type = new TaskStatusType();
                    type.setType(status);
                    repository.save(type);
                }
            }
        };
    }
}
