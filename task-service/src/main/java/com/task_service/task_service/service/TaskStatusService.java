package com.task_service.task_service.service;

import com.task_service.task_service.dto.TaskStatusDTO;
import org.springframework.stereotype.Service;

@Service
public interface TaskStatusService {

    TaskStatusDTO createTaskStatus(TaskStatusDTO taskStatusDTO);

    TaskStatusDTO editTaskStatus(TaskStatusDTO taskStatusDTO);

    boolean deleteTaskStatusByTaskCode(String taskCode);

}
