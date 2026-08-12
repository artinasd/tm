package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PublicEmploymentDTO {
    private PublicEmployeeDTO employee;
    private LocalDateTime joinTime;
    private Boolean isDeleted;
    private RoleDTO role;
    private PublicUnitDTO unit;
}
