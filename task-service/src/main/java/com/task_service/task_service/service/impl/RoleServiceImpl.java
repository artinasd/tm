package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.RoleDTO;
import com.task_service.task_service.entity.Role;
import com.task_service.task_service.mapper.RoleMapper;
import com.task_service.task_service.repository.RoleRepository;
import com.task_service.task_service.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository repository;
    @Autowired
    private RoleMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<RoleDTO> getAllRoles() {
        return repository.findAll().stream().map(mapper::toDTO).toList();
    }

    @Override
    @Transactional
    public RoleDTO createRole(RoleDTO roleDTO) {
        Role role = mapper.toEntity(roleDTO);
        repository.save(role);
        return mapper.toDTO(role);
    }

    @Override
    @Transactional
    public RoleDTO editRole(RoleDTO roleDTO) {
        Role role = repository.findByName(roleDTO.getName());
        updateEntity(role, roleDTO);
        repository.save(role);
        return mapper.toDTO(role);
    }

    private void updateEntity(Role role, RoleDTO roleDTO) {
        if (roleDTO.getName() != null && !roleDTO.getName().isEmpty()) role.setName(roleDTO.getName());
        if (roleDTO.getPermissions() != null && !roleDTO.getPermissions().isEmpty()) role.setPermissions(roleDTO.getPermissions());
    }

    @Override
    public boolean deleteRole(RoleDTO roleDTO) {
        Role role = repository.findByName(roleDTO.getName());
        if (role == null)
            throw new NullPointerException("There is not such a Role!");
        repository.delete(role);
        return true;
    }
}
