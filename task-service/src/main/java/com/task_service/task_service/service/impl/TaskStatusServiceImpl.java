package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.TaskStatusDTO;
import com.task_service.task_service.entity.TaskStatus;
import com.task_service.task_service.mapper.TaskStatusMapper;
import com.task_service.task_service.repository.TaskRepository;
import com.task_service.task_service.repository.TaskStatusRepository;
import com.task_service.task_service.repository.TaskStatusTypeRepository;
import com.task_service.task_service.service.TaskStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskStatusServiceImpl implements TaskStatusService {

    @Autowired
    private TaskStatusRepository repository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TaskStatusTypeRepository typeRepository;
    @Autowired
    private TaskStatusMapper statusMapper;

    @Override
    @Transactional
    public TaskStatusDTO createTaskStatus(TaskStatusDTO taskStatusDTO) {
        TaskStatus taskStatus = statusMapper.toEntity(taskStatusDTO);

        setDetails(taskStatus, taskStatusDTO);

        repository.save(taskStatus);

        return statusMapper.toDTO(taskStatus);
    }

    private void setDetails(TaskStatus taskStatus, TaskStatusDTO taskStatusDTO) {
        if (taskStatusDTO.getTaskCode() != null) taskStatus.setTaskCode(taskStatusDTO.getTaskCode());
        if (taskStatusDTO.getTaskStatusType() != null) taskStatus.setTaskStatusType(typeRepository.findByType(taskStatusDTO.getTaskStatusType().getType()));
    }

    @Override
    @Transactional
    public TaskStatusDTO editTaskStatus(TaskStatusDTO taskStatusDTO) {
        TaskStatus taskStatus = repository.findByTaskCode(taskStatusDTO.getTaskCode());
        if (taskStatus == null)
            throw new NullPointerException("There is not such a TaskStatus!");

        setDetails(taskStatus, taskStatusDTO);
        repository.save(taskStatus);

        return statusMapper.toDTO(taskStatus);
    }

    @Override
    @Transactional
    public boolean deleteTaskStatusByTaskCode(String taskCode) {
        TaskStatus taskStatus = repository.findByTaskCode(taskCode);
        if (taskStatus == null)
            throw new NullPointerException("There is not such a TaskStatus!");

        repository.delete(taskStatus);
        return true;
    }
}
