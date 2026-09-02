package com.task_service.task_service.service;

import com.task_service.task_service.dto.*;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public interface TaskService {

    TaskDTO createTask(TaskDTO taskDTO) throws NoSuchAlgorithmException;

    PublicTaskDTO getTaskByTaskCode(String taskCode);

    List<PublicTaskDTO> getTasksByAccountCode(String accountCode, String status);

    List<PublicTaskDTO> searchTask(String title, LocalDateTime createTime, LocalDateTime startTime,
                             String priority, TaskStatusDTO taskStatusDTO,
                             String ownerName, String responsibleName);

    TaskDTO getTaskDetails(String taskCode, EmploymentDTO client);

    TaskDTO editTask(String taskCode, TaskDTO dto) throws AccessDeniedException;

    TaskDTO startTask(String taskCode) throws AccessDeniedException;

    void deleteTask(String taskCode) throws AccessDeniedException;
}
