package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.WorkTimeDTO;
import com.task_service.task_service.entity.WorkTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class WorkTimeMapper {

    private static TaskMapper taskMapper = new TaskMapper(); // quick hack, create instance manually

    public static WorkTimeDTO toDTO(WorkTime workTime){
        WorkTimeDTO dto = new WorkTimeDTO();

        if (workTime.getWorkTimeCode() != null && !workTime.getWorkTimeCode().isEmpty()) dto.setWorkTimeCode(workTime.getWorkTimeCode());
        if (workTime.getStartTime() != null) dto.setStartTime(workTime.getStartTime());
        if (workTime.getEndTime() != null) dto.setEndTime(workTime.getEndTime());
        if (workTime.getDate() != null) dto.setDate(workTime.getDate());
        if (workTime.getTask() != null) dto.setTask(taskMapper.toDTO(workTime.getTask()));

        return dto;
    }

    public static WorkTime toEntity(WorkTimeDTO dto){
        WorkTime workTime = new WorkTime();

        if (dto.getWorkTimeCode() != null && !workTime.getWorkTimeCode().isEmpty()) workTime.setWorkTimeCode(dto.getWorkTimeCode());
        if (dto.getStartTime() != null) workTime.setStartTime(dto.getStartTime());
        if (dto.getEndTime() != null) workTime.setEndTime(dto.getEndTime());
        if (dto.getDate() != null) workTime.setDate(dto.getDate());
        if (dto.getTask() != null) workTime.setTask(taskMapper.toEntity(dto.getTask()));

        return workTime;
    }
}
