package com.task_service.task_service.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrganizationDTO {
    private String orgCode;
    private String title;
    private String description;
    private String logoUrl;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Boolean isDeleted;
    private EmployeeDTO Boss;
    private List<String> unitCodes;
    private List<String> employeesAccountCode;
}
