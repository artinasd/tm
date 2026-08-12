package com.task_service.task_service.service;

import com.task_service.task_service.dto.RescheduleDTO;
import com.task_service.task_service.dto.TaskDTO;
import org.springframework.stereotype.Service;

@Service
public interface RescheduleService {

    RescheduleDTO createReschedule(TaskDTO taskDTO);

}
