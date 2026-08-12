package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.RoleDTO;
import com.task_service.task_service.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {
    public RoleDTO toDTO(Role role){
        RoleDTO dto = new RoleDTO();

        if (role.getName() != null) dto.setName(role.getName());
        if (role.getPermissions() != null) dto.setPermissions(role.getPermissions());

        return dto;
    }

    public Role toEntity(RoleDTO dto){
        Role role = new Role();

        if (dto.getName() != null) role.setName(dto.getName());
        if (dto.getPermissions() != null) role.setPermissions(dto.getPermissions());

        return role;
    }
}
