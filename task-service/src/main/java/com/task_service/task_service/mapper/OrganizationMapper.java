package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.OrganizationDTO;
import com.task_service.task_service.dto.PublicOrganizationDTO;
import com.task_service.task_service.entity.Account;
import com.task_service.task_service.entity.Employee;
import com.task_service.task_service.entity.Organization;
import com.task_service.task_service.entity.Unit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrganizationMapper {

    @Autowired
    private EmployeeMapper employeeMapper;

    public OrganizationDTO toDTO(Organization organization){
        OrganizationDTO dto = new OrganizationDTO();

        if (organization.getOrgCode() != null) dto.setOrgCode(organization.getOrgCode());
        if (organization.getTitle() != null) dto.setTitle(organization.getTitle());
        if (organization.getDescription() != null) dto.setDescription(organization.getDescription());
        if (organization.getCreateTime() != null) dto.setCreateTime(organization.getCreateTime());
        if (organization.getUpdateTime() != null) dto.setUpdateTime(organization.getUpdateTime());
        if (organization.getLogoUrl() != null) dto.setLogoUrl(organization.getLogoUrl());
        if (organization.getBoss() != null) dto.setBoss(employeeMapper.toDTO(organization.getBoss()));
        if (organization.getEmployees() != null && !organization.getEmployees().isEmpty()){
            List<Employee> employeeList = organization.getEmployees();
            List<String> employeeCodes = new ArrayList<>();

            for (Employee employee : employeeList)
                employeeCodes.add(employee.getAccount().getAccountCode());

            dto.setEmployeesAccountCode(employeeCodes);
        }
        if (organization.getUnits() != null && !organization.getUnits().isEmpty()){
            List<Unit> unitList = organization.getUnits();
            List<String> unitCodes = new ArrayList<>();

            for (Unit unit : unitList)
                unitCodes.add(unit.getUnitCode());

            dto.setUnitCodes(unitCodes);
        }
        dto.setIsDeleted(organization.getIsDeleted());

        return dto;
    }

    public Organization toEntity(OrganizationDTO dto){
        Organization organization = new Organization();

        if (dto.getOrgCode() != null) organization.setOrgCode(dto.getOrgCode());
        if (dto.getTitle() != null) organization.setTitle(dto.getTitle());
        if (dto.getDescription() != null) organization.setDescription(dto.getDescription());
        if (dto.getCreateTime() != null) organization.setCreateTime(dto.getCreateTime());
        if (dto.getUpdateTime() != null) organization.setUpdateTime(dto.getUpdateTime());
        if (dto.getLogoUrl() != null) organization.setLogoUrl(dto.getLogoUrl());
        if (dto.getBoss() != null) organization.setBoss(employeeMapper.toEntity(dto.getBoss()));
        if (dto.getEmployeesAccountCode() != null && !dto.getEmployeesAccountCode().isEmpty()){
            List<String> employeeCodes = dto.getEmployeesAccountCode();
            List<Employee> employeeList = new ArrayList<>();

            for (String code : employeeCodes){
                Account account = new Account();
                account.setAccountCode(code);
                Employee employee = new Employee();
                employee.setAccount(account);

                employeeList.add(employee);
            }

            organization.setEmployees(employeeList);
        }
        if (dto.getUnitCodes() != null && !dto.getUnitCodes().isEmpty()){
            List<Unit> unitList = new ArrayList<>();
            List<String> unitCodes = dto.getUnitCodes();

            for (String code : unitCodes){
                Unit unit = new Unit();
                unit.setUnitCode(code);

                unitList.add(unit);
            }

            organization.setUnits(unitList);
        }
        organization.setIsDeleted(dto.getIsDeleted());

        return organization;
    }

    public PublicOrganizationDTO transferEntityToPublic(Organization organization){
        PublicOrganizationDTO publicDTO = new PublicOrganizationDTO();

        if (organization.getOrgCode() != null && !organization.getOrgCode().isEmpty()) publicDTO.setOrgCode(organization.getOrgCode());
        if (organization.getTitle() != null && !organization.getTitle().isEmpty()) publicDTO.setTitle(organization.getTitle());
        if (organization.getDescription() != null && !organization.getDescription().isEmpty()) publicDTO.setDescription(organization.getDescription());
        if (organization.getCreateTime() != null) publicDTO.setCreateTime(organization.getCreateTime());
        if (organization.getLogoUrl() != null && !organization.getLogoUrl().isEmpty()) publicDTO.setLogoUrl(organization.getLogoUrl());
        if (organization.getBoss() != null) publicDTO.setBoss(employeeMapper.transferEntityToPublic(organization.getBoss()));
        publicDTO.setIsDeleted(organization.getIsDeleted());

        return publicDTO;
    }

    public PublicOrganizationDTO transferDTOToPublic(OrganizationDTO dto){
        PublicOrganizationDTO publicDTO = new PublicOrganizationDTO();

        if (dto.getOrgCode() != null && !dto.getOrgCode().isEmpty()) publicDTO.setOrgCode(dto.getOrgCode());
        if (dto.getTitle() != null && !dto.getTitle().isEmpty()) publicDTO.setTitle(dto.getTitle());
        if (dto.getDescription() != null && !dto.getDescription().isEmpty()) publicDTO.setDescription(dto.getDescription());
        if (dto.getCreateTime() != null) publicDTO.setCreateTime(dto.getCreateTime());
        if (dto.getLogoUrl() != null && !dto.getLogoUrl().isEmpty()) publicDTO.setLogoUrl(dto.getLogoUrl());
        if (dto.getBoss() != null) publicDTO.setBoss(employeeMapper.transferDTOToPublic(dto.getBoss()));
        publicDTO.setIsDeleted(dto.getIsDeleted());

        return publicDTO;
    }
}
