package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class EmployeeDTO {
    private LocalDateTime hiredAt;
    private LocalDateTime updateTime;
    private Boolean isActive;
    private Boolean isDeleted;
    private AccountDTO account;
    private String orgCode;
    private List<String> unitCodes;
}
