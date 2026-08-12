package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.WorkTimeDTO;
import com.task_service.task_service.entity.Task;
import com.task_service.task_service.entity.WorkTime;
import com.task_service.task_service.mapper.WorkTimeMapper;
import com.task_service.task_service.repository.TaskRepository;
import com.task_service.task_service.repository.WorkTimeRepository;
import com.task_service.task_service.service.WorkTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class WorkTimeServiceImpl implements WorkTimeService {

    @Autowired
    private WorkTimeRepository repository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private WorkTimeMapper mapper;

    @Transactional
    @Override
    public WorkTimeDTO startWorkTime(String taskCode) {
        WorkTime workTime = new WorkTime();

        setDetails(workTime, taskCode);

        repository.save(workTime);

        return mapper.toDTO(workTime);
    }

    private void setDetails(WorkTime workTime, String taskCode) {
        workTime.setDate(LocalDate.now());
        workTime.setStartTime(LocalDateTime.now());
        workTime.setTask(taskRepository.findByTaskCode(taskCode));
        repository.save(workTime); // We need ID
        workTime.setWorkTimeCode(workTime.getId().toString());
    }

    @Transactional
    @Override
    public WorkTimeDTO endWorkTime(String workTimeCode) {
        WorkTime workTime = repository.findByWorkTimeCode(workTimeCode);
        workTime.setEndTime(LocalDateTime.now());
        repository.save(workTime);
        return mapper.toDTO(workTime);
    }

    @Transactional
    @Override
    public WorkTimeDTO editWorkTime(WorkTimeDTO workTimeDTO) {
        WorkTime workTime = repository.findByWorkTimeCode(workTimeDTO.getWorkTimeCode());

        updateEntity(workTime, workTimeDTO);

        repository.save(workTime);

        return mapper.toDTO(workTime);
    }

    private void updateEntity(WorkTime workTime, WorkTimeDTO workTimeDTO) {
        LocalDateTime startTime;
        LocalDateTime endTime;
        Task newTask;

        if (workTimeDTO.getTask() != null) newTask = taskRepository.findByTaskCode(workTimeDTO.getTask().getTaskCode());
        else newTask = workTime.getTask();

        if (workTimeDTO.getStartTime() != null) startTime = workTimeDTO.getStartTime();
        else startTime = workTime.getStartTime();

        if (workTimeDTO.getEndTime() != null) endTime = workTimeDTO.getEndTime();
        else endTime = workTime.getEndTime();

        approveInfo(startTime,endTime,newTask);

        if (startTime.isBefore(LocalDateTime.now()) && startTime.isBefore(endTime)){
            workTime.setStartTime(startTime);
            workTime.setDate(startTime.toLocalDate());
        }
        if (endTime.isBefore(LocalDateTime.now()) && endTime.isAfter(startTime)) workTime.setEndTime(endTime);
        if (workTimeDTO.getTask() != null && startTime.isAfter(newTask.getCreateTime())) workTime.setTask(newTask);
    }

    private void approveInfo(LocalDateTime startTime, LocalDateTime endTime, Task task) {
        if (startTime == null || endTime == null || task == null)
            throw  new NullPointerException("StartTime or endTime or task is null!");

        if (startTime.isAfter(endTime))
            throw new IllegalStateException("Start time is after End time!");
        else
            if (startTime.isBefore(task.getCreateTime()))
                throw new IllegalStateException("Start Time is before createTime of task!");
    }

    @Override
    public WorkTimeDTO createWorkTime(WorkTimeDTO workTimeDTO) {
        Task task = taskRepository.findByTaskCode(workTimeDTO.getTask().getTaskCode());
        approveInfo(workTimeDTO.getStartTime(), workTimeDTO.getEndTime(), task);

        WorkTime workTime = mapper.toEntity(workTimeDTO);
        workTime.setTask(task);
        repository.save(workTime); // We need ID
        workTime.setWorkTimeCode(workTime.getId().toString());

        repository.save(workTime);

        return mapper.toDTO(workTime);
    }

    @Override
    public boolean deleteWorkTime(String workTimeCode) {
        WorkTime workTime = repository.findByWorkTimeCode(workTimeCode);
        repository.delete(workTime);
        return false;
    }
}
