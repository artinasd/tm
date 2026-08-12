package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.TaskStatusDTO;
import com.task_service.task_service.entity.TaskStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TaskStatusMapper {

    @Autowired
    private TaskStatusTypeMapper typeMapper;

    public TaskStatusDTO toDTO(TaskStatus taskStatus){
        TaskStatusDTO dto = new TaskStatusDTO();

        if (taskStatus.getTime() != null) dto.setTime(taskStatus.getTime());
        if (taskStatus.getTaskCode() != null) dto.setTaskCode(taskStatus.getTaskCode());
        if (taskStatus.getTaskStatusType() != null) dto.setTaskStatusType(typeMapper.toDTO(taskStatus.getTaskStatusType()));

        return dto;
    }

    public TaskStatus toEntity(TaskStatusDTO dto){
        TaskStatus taskStatus = new TaskStatus();

        if (dto.getTime() != null) taskStatus.setTime(dto.getTime());
        if (dto.getTaskCode() != null) taskStatus.setTaskCode(dto.getTaskCode());
        if (dto.getTaskStatusType() != null) taskStatus.setTaskStatusType(typeMapper.toEntity(dto.getTaskStatusType()));

        return taskStatus;
    }
}
