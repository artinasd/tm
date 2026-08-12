package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.EmployeeDTO;
import com.task_service.task_service.dto.PublicEmployeeDTO;
import com.task_service.task_service.entity.Employee;
import com.task_service.task_service.entity.Employment;
import com.task_service.task_service.entity.Organization;
import com.task_service.task_service.entity.Unit;
import com.task_service.task_service.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class EmployeeMapper {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AccountMapper accountMapper;

    public EmployeeDTO toDTO(Employee employee){
        EmployeeDTO dto = new EmployeeDTO();

        if (employee.getHiredAt() != null) dto.setHiredAt(employee.getHiredAt());
        if (employee.getUpdateTime() != null) dto.setUpdateTime(employee.getUpdateTime());
        dto.setIsActive(employee.getIsActive());
        if (employee.getAccount() != null) dto.setAccount(accountMapper.toDTO(employee.getAccount()));
        if (employee.getOrganization() != null) dto.setOrgCode(employee.getOrganization().getOrgCode());
        if (employee.getEmployments() != null) {
            List<String> unitCodes = new ArrayList<>();
            List<Employment> employmentList = employee.getEmployments();

            for (Employment employment : employmentList)
                unitCodes.add(employment.getUnit().getUnitCode());

            dto.setUnitCodes(unitCodes);
        }
        dto.setIsDeleted(employee.getIsDeleted());

        return dto;
    }

    public Employee toEntity(EmployeeDTO dto){
        Employee employee = new Employee();

        if (dto.getHiredAt() != null) employee.setHiredAt(dto.getHiredAt());
        if (dto.getUpdateTime() != null) employee.setUpdateTime(dto.getUpdateTime());
        employee.setIsActive(dto.getIsActive());
        if (dto.getAccount() != null) employee.setAccount(accountRepository.findByAccountCode(dto.getAccount().getAccountCode()));
        if (dto.getOrgCode() != null && !dto.getOrgCode().isEmpty()){
            Organization org = new Organization();
            org.setOrgCode(dto.getOrgCode());
            employee.setOrganization(org);
        }
        if (dto.getUnitCodes() != null) {
            List<String> unitCodes = dto.getUnitCodes();
            List<Employment> employmentList = new ArrayList<>();

            for (String code : unitCodes){
                Employment employment = new Employment();
                Unit unit = new Unit();
                unit.setUnitCode(code);
                employment.setUnit(unit);
            }

            employee.setEmployments(employmentList);
        }
        employee.setIsDeleted(dto.getIsDeleted());

        return employee;
    }

    public PublicEmployeeDTO transferEntityToPublic(Employee employee){
        PublicEmployeeDTO publicEmployee = new PublicEmployeeDTO();

        if (employee.getAccount() != null) publicEmployee.setAccount(accountMapper.transferEntityToPublicDTO(employee.getAccount()));
        if (employee.getHiredAt() != null) publicEmployee.setHiredAt(employee.getHiredAt());
        if (employee.getOrganization() != null) publicEmployee.setOrgCode(employee.getOrganization().getOrgCode());
        publicEmployee.setIsActive(employee.getIsActive());
        publicEmployee.setIsDeleted(employee.getIsDeleted());

        return publicEmployee;
    }

    public PublicEmployeeDTO transferDTOToPublic(EmployeeDTO dto){
        PublicEmployeeDTO publicEmployee = new PublicEmployeeDTO();

        if (dto.getAccount() != null) publicEmployee.setAccount(accountMapper.transferDTOToPublicDTO(dto.getAccount()));
        if (dto.getHiredAt() != null) publicEmployee.setHiredAt(dto.getHiredAt());
        if (dto.getOrgCode() != null) publicEmployee.setOrgCode(dto.getOrgCode());
        publicEmployee.setIsActive(dto.getIsActive());
        publicEmployee.setIsDeleted(dto.getIsDeleted());

        return publicEmployee;
    }
}
