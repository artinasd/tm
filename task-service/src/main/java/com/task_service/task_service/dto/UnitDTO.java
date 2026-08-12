package com.task_service.task_service.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UnitDTO {
    private String unitCode;
    private String unitName;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String bossTitle;
    private EmployeeDTO boss;
    private OrganizationDTO organization;
    private Boolean isDeleted;
    private List<String> employeeCodes;
    private String unitPath;
    private String parentUnitCode;
}
