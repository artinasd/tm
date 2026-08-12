package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.RescheduleDTO;
import com.task_service.task_service.entity.Reschedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RescheduleMapper {

    @Autowired
    private TaskMapper taskMapper;

    public RescheduleDTO toDTO(Reschedule reschedule){
        RescheduleDTO dto = new RescheduleDTO();

        if (reschedule.getTask() != null) dto.setTask(taskMapper.toDTO(reschedule.getTask()));
        if (reschedule.getDeadline() != null) dto.setDeadline(reschedule.getDeadline());
        if (reschedule.getWorkMinutes() != null) dto.setWorkMinutes(reschedule.getWorkMinutes());
        if (reschedule.getStartTime() != null) dto.setStartTime(reschedule.getStartTime());
        if (reschedule.getEndTime() != null) dto.setEndTime(reschedule.getEndTime());

        return dto;
    }

    public Reschedule toEntity(RescheduleDTO dto){
        Reschedule reschedule = new Reschedule();

        if (dto.getTask() != null) reschedule.setTask(taskMapper.toEntity(dto.getTask()));
        if (dto.getDeadline() != null) reschedule.setDeadline(dto.getDeadline());
        if (dto.getWorkMinutes() != null) reschedule.setWorkMinutes(dto.getWorkMinutes());
        if (dto.getStartTime() != null) reschedule.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) reschedule.setEndTime(dto.getEndTime());

        return reschedule;
    }
}
