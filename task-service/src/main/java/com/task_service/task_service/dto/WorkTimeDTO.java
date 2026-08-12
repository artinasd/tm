package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class WorkTimeDTO {
    private String workTimeCode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDate date;
    private TaskDTO task;
}
