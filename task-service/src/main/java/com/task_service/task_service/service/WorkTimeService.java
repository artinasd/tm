package com.task_service.task_service.service;

import com.task_service.task_service.dto.WorkTimeDTO;
import org.springframework.stereotype.Service;

@Service
public interface WorkTimeService {

    WorkTimeDTO startWorkTime(String taskCode);

    WorkTimeDTO endWorkTime(String workTimeCode);

    WorkTimeDTO editWorkTime(WorkTimeDTO workTimeDTO);

    WorkTimeDTO createWorkTime(WorkTimeDTO workTimeDTO);

    boolean deleteWorkTime(String workTimeCode);

}
