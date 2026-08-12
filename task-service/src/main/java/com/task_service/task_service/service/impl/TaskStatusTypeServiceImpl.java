package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.TaskStatusTypeDTO;
import com.task_service.task_service.entity.TaskStatusType;
import com.task_service.task_service.mapper.TaskStatusTypeMapper;
import com.task_service.task_service.repository.TaskStatusTypeRepository;
import com.task_service.task_service.service.TaskStatusTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskStatusTypeServiceImpl implements TaskStatusTypeService {

    @Autowired
    private TaskStatusTypeRepository repository;

    @Autowired
    private TaskStatusTypeMapper mapper;

    @Override
    @Transactional
    public TaskStatusTypeDTO createTaskStatusType(String typeDTO) {
        TaskStatusType type = new TaskStatusType();

        type.setType(typeDTO);

        repository.save(type);

        return mapper.toDTO(type);
    }

    @Override
    @Transactional
    public boolean deleteTaskStatusType(String typeDTO) {
        TaskStatusType type = repository.findByType(typeDTO);

        if (type == null) {
            throw new NullPointerException("TaskStatusType does not exist!");
        }

        repository.delete(type);
        return true;
    }
}
