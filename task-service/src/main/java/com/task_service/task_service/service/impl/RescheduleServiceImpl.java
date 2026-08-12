package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.RescheduleDTO;
import com.task_service.task_service.dto.TaskDTO;
import com.task_service.task_service.entity.Reschedule;
import com.task_service.task_service.mapper.RescheduleMapper;
import com.task_service.task_service.repository.RescheduleRepository;
import com.task_service.task_service.repository.TaskRepository;
import com.task_service.task_service.service.RescheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RescheduleServiceImpl implements RescheduleService {

    @Autowired
    private RescheduleRepository repository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private RescheduleMapper mapper;

    @Override
    @Transactional
    public RescheduleDTO createReschedule(TaskDTO taskDTO) {
        Reschedule reschedule = new Reschedule();

        setDetails(reschedule, taskDTO);
        repository.save(reschedule);

        return mapper.toDTO(reschedule);
    }

    private void setDetails(Reschedule reschedule, TaskDTO taskDTO) {
        reschedule.setTask(taskRepository.findByTaskCode(taskDTO.getTaskCode()));
        if (taskDTO.getStartTime() != null) reschedule.setStartTime(taskDTO.getStartTime());
        if (taskDTO.getEndTime() != null) reschedule.setEndTime(taskDTO.getEndTime());
        if (taskDTO.getDeadline() != null) reschedule.setDeadline(taskDTO.getDeadline());
        if (taskDTO.getWorkMinutes() != null) reschedule.setWorkMinutes(taskDTO.getWorkMinutes());
    }
}
