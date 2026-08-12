package com.task_service.task_service.service;

import com.task_service.task_service.dto.RoleDTO;
import org.springframework.stereotype.Service;

@Service
public interface RoleService {

    RoleDTO createRole(RoleDTO roleDTO);

    RoleDTO editRole(RoleDTO roleDTO);

    boolean deleteRole(RoleDTO roleDTO);

}
