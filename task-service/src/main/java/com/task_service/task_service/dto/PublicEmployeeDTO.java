package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PublicEmployeeDTO {
    private LocalDateTime hiredAt;
    private Boolean isActive;
    private Boolean isDeleted;
    private PublicAccountDTO account;
    private String orgCode;
}
