package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class EmploymentDTO {
    private EmployeeDTO employee;
    private LocalDateTime joinTime;
    private Boolean isDeleted;
    private RoleDTO role;
    private UnitDTO unit;
}
