package com.task_service.task_service.dto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
public class TaskDTO {
    private String taskCode;
    private String title;
    private String description;
    private LocalDateTime createTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime deadline;
    private Long workMinutes;
    private LocalDateTime updateTime;
    private LocalDateTime pinDate;
    private int taskWeight;
    private String priority;
    private Boolean isDeleted;
    private EmploymentDTO owner;
    private EmploymentDTO responsible;
    private TaskStatusDTO taskStatus;
    private List<TaskStatusDTO> taskStatusHistory;
    private UnitDTO unit;
    private String taskPath;
}
