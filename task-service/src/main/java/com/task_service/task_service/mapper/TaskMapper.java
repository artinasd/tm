package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.PublicTaskDTO;
import com.task_service.task_service.dto.TaskDTO;
import com.task_service.task_service.entity.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class TaskMapper {

    @Autowired
    private EmploymentMapper employmentMapper;
    @Autowired
    private TaskStatusMapper statusMapper;
    @Autowired
    private UnitMapper unitMapper;

    public TaskDTO toDTO (Task task){
        TaskDTO dto = new TaskDTO();

        if (task.getTaskCode() != null && !task.getTaskCode().isEmpty()) dto.setTaskCode(task.getTaskCode());
        if (task.getTitle() != null && !task.getTitle().isEmpty()) dto.setTitle(task.getTitle());
        if (task.getDescription() != null && !task.getDescription().isEmpty()) dto.setDescription(task.getDescription());
        if (task.getCreateTime() != null) dto.setCreateTime(task.getCreateTime());
        if (task.getStartTime() != null) dto.setStartTime(task.getStartTime());
        if (task.getEndTime() != null) dto.setEndTime(task.getEndTime());
        if (task.getDeadline() != null) dto.setDeadline(task.getDeadline());
        if (task.getWorkMinutes() != null) dto.setWorkMinutes(task.getWorkMinutes());
        if (task.getUpdateTime() != null) dto.setUpdateTime(task.getUpdateTime());
        dto.setTaskWeight(task.getTaskWeight());
        if (task.getPinDate() != null) dto.setPinDate(task.getPinDate());
        if (task.getPriority() != null) dto.setPriority(task.getPriority());
        if (task.getOwner() != null) dto.setOwner(employmentMapper.toDTO(task.getOwner()));
        if (task.getResponsible() != null) dto.setResponsible(employmentMapper.toDTO(task.getResponsible()));
        if (task.getTaskStatus() != null) dto.setTaskStatus(statusMapper.toDTO(task.getTaskStatus()));
        if (task.getTaskStatusHistory() != null) dto.setTaskStatusHistory(
                task.getTaskStatusHistory().stream()
                        .map(statusMapper::toDTO)
                        .collect(Collectors.toList()));
        if (task.getUnit() != null) dto.setUnit(unitMapper.toDTO(task.getUnit()));
        if (task.getTaskPath() != null) dto.setTaskPath(task.getTaskPath());
        dto.setIsDeleted(task.getIsDeleted());

        return dto;
    }

    public Task toEntity(TaskDTO dto){
        Task task = new Task();

        if (dto.getTaskCode() != null && !dto.getTaskCode().isEmpty()) dto.setTaskCode(task.getTaskCode());
        if (dto.getTitle() != null && !dto.getTitle().isEmpty()) task.setTitle(dto.getTitle());
        if (dto.getDescription() != null && !dto.getDescription().isEmpty()) task.setDescription(dto.getDescription());
        if (dto.getCreateTime() != null) task.setCreateTime(dto.getCreateTime());
        if (dto.getStartTime() != null) task.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) task.setEndTime(dto.getEndTime());
        if (dto.getDeadline() != null) task.setDeadline(dto.getDeadline());
        if (dto.getWorkMinutes() != null) task.setWorkMinutes(dto.getWorkMinutes());
        if (dto.getUpdateTime() != null) task.setUpdateTime(dto.getUpdateTime());
        if (dto.getPinDate() != null) task.setPinDate(dto.getPinDate());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        task.setTaskWeight(dto.getTaskWeight());
        if (dto.getOwner() != null) task.setOwner(employmentMapper.toEntity(dto.getOwner()));
        if (dto.getResponsible() != null) task.setResponsible(employmentMapper.toEntity(dto.getResponsible()));
        if (dto.getTaskStatus() != null) task.setTaskStatus(statusMapper.toEntity(dto.getTaskStatus()));
        if (dto.getTaskStatusHistory() != null) task.setTaskStatusHistory(
                dto.getTaskStatusHistory().stream()
                        .map(statusMapper::toEntity)
                        .collect(Collectors.toList()));
        if (dto.getUnit() != null) task.setUnit(unitMapper.toEntity(dto.getUnit()));
        if (dto.getTaskPath() != null) task.setTaskPath(dto.getTaskPath());
        task.setIsDeleted(dto.getIsDeleted());

        return task;
    }

    public PublicTaskDTO transferEntityToPublic(Task task){
        PublicTaskDTO publicTask = new PublicTaskDTO();

        if (task.getTaskCode() != null && !task.getTaskCode().isEmpty()) publicTask.setTaskCode(task.getTaskCode());
        if (task.getTitle() != null && !task.getTitle().isEmpty()) publicTask.setTitle(task.getTitle());
        if (task.getDescription() != null && !task.getDescription().isEmpty()) publicTask.setDescription(task.getDescription());
        if (task.getCreateTime() != null) publicTask.setCreateTime(task.getCreateTime());
        if (task.getStartTime() != null) publicTask.setStartTime(task.getStartTime());
        if (task.getEndTime() != null) publicTask.setEndTime(task.getEndTime());
        if (task.getDeadline() != null) publicTask.setDeadline(task.getDeadline());
        if (task.getWorkMinutes() != null) publicTask.setWorkedMinutes(task.getWorkMinutes());
        if (task.getUpdateTime() != null) publicTask.setUpdateTime(task.getUpdateTime());
        publicTask.setTaskWeight(task.getTaskWeight());
        if (task.getPinDate() != null) publicTask.setPinDate(task.getPinDate());
        if (task.getPriority() != null) publicTask.setPriority(task.getPriority());
        if (task.getOwner() != null) publicTask.setOwner(employmentMapper.transferEntityToPublic(task.getOwner()));
        if (task.getResponsible() != null) publicTask.setResponsible(employmentMapper.transferEntityToPublic(task.getResponsible()));
        if (task.getTaskStatus() != null) publicTask.setTaskStatus(statusMapper.toDTO(task.getTaskStatus()));
        if (task.getUnit() != null) publicTask.setUnit(unitMapper.transferEntityToPublic(task.getUnit()));
        publicTask.setIsDeleted(task.getIsDeleted());

        return publicTask;
    }

    public PublicTaskDTO transferDTOToPublic(TaskDTO dto){
        PublicTaskDTO publicTask = new PublicTaskDTO();

        if (dto.getTaskCode() != null && !dto.getTaskCode().isEmpty()) publicTask.setTaskCode(dto.getTaskCode());
        if (dto.getTitle() != null && !dto.getTitle().isEmpty()) publicTask.setTitle(dto.getTitle());
        if (dto.getDescription() != null && !dto.getDescription().isEmpty()) publicTask.setDescription(dto.getDescription());
        if (dto.getCreateTime() != null) publicTask.setCreateTime(dto.getCreateTime());
        if (dto.getStartTime() != null) publicTask.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) publicTask.setEndTime(dto.getEndTime());
        if (dto.getDeadline() != null) publicTask.setDeadline(dto.getDeadline());
        if (dto.getWorkMinutes() != null) publicTask.setWorkedMinutes(dto.getWorkMinutes());
        if (dto.getUpdateTime() != null) publicTask.setUpdateTime(dto.getUpdateTime());
        publicTask.setTaskWeight(dto.getTaskWeight());
        if (dto.getPinDate() != null) publicTask.setPinDate(dto.getPinDate());
        if (dto.getPriority() != null) publicTask.setPriority(dto.getPriority());
        if (dto.getOwner() != null) publicTask.setOwner(employmentMapper.transferDTOToPublic(dto.getOwner()));
        if (dto.getResponsible() != null) publicTask.setResponsible(employmentMapper.transferDTOToPublic(dto.getResponsible()));
        if (dto.getTaskStatus() != null) publicTask.setTaskStatus(dto.getTaskStatus());
        if (dto.getUnit() != null) publicTask.setUnit(unitMapper.transferDTOToPublic(dto.getUnit()));
        publicTask.setIsDeleted(dto.getIsDeleted());

        return publicTask;
    }
}
