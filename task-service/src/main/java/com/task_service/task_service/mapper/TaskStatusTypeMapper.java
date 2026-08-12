package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.TaskStatusTypeDTO;
import com.task_service.task_service.entity.TaskStatusType;
import org.springframework.stereotype.Component;

@Component
public class TaskStatusTypeMapper {
    public TaskStatusTypeDTO toDTO(TaskStatusType taskStatusType){
        TaskStatusTypeDTO dto = new TaskStatusTypeDTO();

        if (taskStatusType.getType() != null) dto.setType(taskStatusType.getType());

        return dto;
    }

    public TaskStatusType toEntity(TaskStatusTypeDTO dto){
        TaskStatusType taskStatusType = new TaskStatusType();

        if (dto.getType() != null) taskStatusType.setType(dto.getType());

        return taskStatusType;
    }
}
