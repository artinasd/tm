package com.task_service.task_service.service;

import com.task_service.task_service.dto.TaskStatusTypeDTO;
import org.springframework.stereotype.Service;

@Service
public interface TaskStatusTypeService {

    TaskStatusTypeDTO createTaskStatusType(String typeDTO);

    boolean deleteTaskStatusType(String typeDTO);

}
