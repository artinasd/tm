package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PublicUnitDTO {
    private String unitCode;
    private String unitName;
    private String bossTitle;
    private PublicEmployeeDTO boss;
    private PublicOrganizationDTO organization;
    private Boolean isDeleted;
    private List<String> employeeCodes;
}
