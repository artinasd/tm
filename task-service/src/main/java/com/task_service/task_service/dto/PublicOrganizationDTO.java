package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PublicOrganizationDTO {
    private String orgCode;
    private String title;
    private String description;
    private String logoUrl;
    private LocalDateTime createTime;
    private Boolean isDeleted;
    private PublicEmployeeDTO boss;
}
