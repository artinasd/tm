package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PublicTaskDTO {
    private String taskCode;
    private String title;
    private String description;
    private LocalDateTime createTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime deadline;
    private Long workedMinutes;
    private LocalDateTime updateTime;
    private LocalDateTime pinDate;
    private int taskWeight;
    private String priority;
    private Boolean isDeleted;
    private PublicEmploymentDTO owner;
    private PublicEmploymentDTO responsible;
    private TaskStatusDTO taskStatus;
    private PublicUnitDTO unit;
}
