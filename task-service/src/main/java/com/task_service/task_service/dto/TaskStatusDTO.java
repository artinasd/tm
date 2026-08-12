package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class TaskStatusDTO {
    private LocalDateTime time;
    private String taskCode;
    private TaskStatusTypeDTO taskStatusType;
}
