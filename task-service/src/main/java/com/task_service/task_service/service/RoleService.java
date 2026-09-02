package com.task_service.task_service.service;

import com.task_service.task_service.dto.RoleDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoleService {

    List<RoleDTO> getAllRoles();

    RoleDTO createRole(RoleDTO roleDTO);

    RoleDTO editRole(RoleDTO roleDTO);

    boolean deleteRole(RoleDTO roleDTO);
}
