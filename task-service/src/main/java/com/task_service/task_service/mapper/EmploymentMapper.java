package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.EmploymentDTO;
import com.task_service.task_service.dto.PublicEmploymentDTO;
import com.task_service.task_service.entity.Employment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmploymentMapper {

    @Autowired
    private EmployeeMapper employeeMapper;
    @Autowired
    private RoleMapper roleMapper;
    @Autowired
    private UnitMapper unitMapper;

    public EmploymentDTO toDTO(Employment employment){
        EmploymentDTO dto = new EmploymentDTO();

        if (employment.getEmployee() != null) dto.setEmployee(employeeMapper.toDTO(employment.getEmployee()));
        if (employment.getRole() != null) dto.setRole(roleMapper.toDTO(employment.getRole()));
        if (employment.getUnit() != null) dto.setUnit(unitMapper.toDTO(employment.getUnit()));
        if (employment.getJoinTime() != null) dto.setJoinTime(employment.getJoinTime());
        dto.setIsDeleted(employment.getIsDeleted());

        return dto;
    }

    public Employment toEntity(EmploymentDTO dto){
        Employment employment = new Employment();

        if (dto.getEmployee() != null) employment.setEmployee(employeeMapper.toEntity(dto.getEmployee()));
        if (dto.getRole() != null) employment.setRole(roleMapper.toEntity(dto.getRole()));
        if (dto.getUnit() != null) employment.setUnit(unitMapper.toEntity(dto.getUnit()));
        if (dto.getJoinTime() != null) employment.setJoinTime(dto.getJoinTime());
        employment.setIsDeleted(dto.getIsDeleted());

        return employment;
    }

    public PublicEmploymentDTO transferEntityToPublic(Employment employment){
        PublicEmploymentDTO publicEmployment = new PublicEmploymentDTO();

        if (employment.getEmployee() != null) publicEmployment.setEmployee(employeeMapper.transferEntityToPublic(employment.getEmployee()));
        if (employment.getUnit() != null) publicEmployment.setUnit(unitMapper.transferEntityToPublic(employment.getUnit()));
        if (employment.getRole() != null) publicEmployment.setRole(roleMapper.toDTO(employment.getRole()));
        if (employment.getJoinTime() != null) publicEmployment.setJoinTime(employment.getJoinTime());
        publicEmployment.setIsDeleted(employment.getIsDeleted());

        return publicEmployment;
    }

    public PublicEmploymentDTO transferDTOToPublic(EmploymentDTO employmentDTO){
        PublicEmploymentDTO publicEmployment = new PublicEmploymentDTO();

        if (employmentDTO.getEmployee() != null) publicEmployment.setEmployee(employeeMapper.transferDTOToPublic(employmentDTO.getEmployee()));
        if (employmentDTO.getUnit() != null) publicEmployment.setUnit(unitMapper.transferDTOToPublic(employmentDTO.getUnit()));
        if (employmentDTO.getRole() != null) publicEmployment.setRole(employmentDTO.getRole());
        if (employmentDTO.getJoinTime() != null) publicEmployment.setJoinTime(employmentDTO.getJoinTime());
        publicEmployment.setIsDeleted(employmentDTO.getIsDeleted());

        return publicEmployment;
    }
}
