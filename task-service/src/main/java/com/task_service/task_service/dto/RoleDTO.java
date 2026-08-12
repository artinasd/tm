package com.task_service.task_service.dto;

import com.task_service.task_service.security.ActionType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class RoleDTO {
    private String name;
    private List<ActionType> permissions;
}
