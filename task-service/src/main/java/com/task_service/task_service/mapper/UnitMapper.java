package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.PublicUnitDTO;
import com.task_service.task_service.dto.UnitDTO;
import com.task_service.task_service.entity.Account;
import com.task_service.task_service.entity.Employee;
import com.task_service.task_service.entity.Employment;
import com.task_service.task_service.entity.Unit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class UnitMapper {

    @Autowired
    private EmployeeMapper employeeMapper;
    @Autowired
    private OrganizationMapper organizationMapper;

    public UnitDTO toDTO (Unit unit){
        UnitDTO dto = new UnitDTO();

        if (unit.getUnitCode() != null && !unit.getUnitCode().isEmpty()) dto.setUnitCode(unit.getUnitCode());
        if (unit.getUnitName() != null && !unit.getUnitName().isEmpty()) dto.setUnitName(unit.getUnitName());
        if (unit.getBoss() != null) dto.setBoss(employeeMapper.toDTO(unit.getBoss()));
        if (unit.getBossTitle() != null) dto.setBossTitle(unit.getBossTitle());
        if (unit.getCreateTime() != null) dto.setCreateTime(unit.getCreateTime());
        if (unit.getUpdateTime() != null) dto.setUpdateTime(unit.getUpdateTime());
        if (unit.getOrganization() != null) dto.setOrganization(organizationMapper.toDTO(unit.getOrganization()));
        if (unit.getEmployees() != null && !unit.getEmployees().isEmpty()){
            List<Employment> employmentList = unit.getEmployees();
            List<String> employeeCodes = new ArrayList<>();
            
            for (Employment employment : employmentList)
                employeeCodes.add(employment.getEmployee().getAccount().getAccountCode());
            
            dto.setEmployeeCodes(employeeCodes);
        }
        if (unit.getUnitPath() != null) dto.setUnitPath(unit.getUnitPath());
        dto.setIsDeleted(unit.getIsDeleted());

        return dto;
    }

    public Unit toEntity(UnitDTO dto){
        Unit unit = new Unit();

        if (dto.getUnitCode() != null && !dto.getUnitCode().isEmpty()) unit.setUnitCode(dto.getUnitCode());
        if (dto.getUnitName() != null && !dto.getUnitName().isEmpty()) unit.setUnitName(dto.getUnitName());
        if (dto.getBoss() != null) unit.setBoss(employeeMapper.toEntity(dto.getBoss()));
        if (dto.getBossTitle() != null) unit.setBossTitle(dto.getBossTitle());
        if (dto.getCreateTime() != null) unit.setCreateTime(dto.getCreateTime());
        if (dto.getUpdateTime() != null) unit.setUpdateTime(dto.getUpdateTime());
        if (dto.getOrganization() != null) unit.setOrganization(organizationMapper.toEntity(dto.getOrganization()));
        if (dto.getEmployeeCodes() != null && !dto.getEmployeeCodes().isEmpty()){
            List<Employment> employmentList = getEmploymentList(dto);

            unit.setEmployees(employmentList);
        }
        if (dto.getUnitPath() != null) unit.setUnitPath(dto.getUnitPath());
        unit.setIsDeleted(dto.getIsDeleted());

        return unit;
    }

    public PublicUnitDTO transferDTOToPublic(UnitDTO dto){
        PublicUnitDTO publicUnitDTO = new PublicUnitDTO();

        if (dto.getUnitName() != null && !dto.getUnitName().isEmpty()) publicUnitDTO.setUnitName(dto.getUnitName());
        if (dto.getUnitCode() != null && !dto.getUnitCode().isEmpty()) publicUnitDTO.setUnitCode(dto.getUnitCode());
        if (dto.getBoss() != null) publicUnitDTO.setBoss(employeeMapper.transferDTOToPublic(dto.getBoss()));
        if (dto.getBossTitle() != null && !dto.getBossTitle().isEmpty()) publicUnitDTO.setBossTitle(dto.getBossTitle());
        if (dto.getOrganization() != null) publicUnitDTO.setOrganization(organizationMapper.transferDTOToPublic(dto.getOrganization()));
        if (dto.getEmployeeCodes() != null && !dto.getEmployeeCodes().isEmpty()) publicUnitDTO.setEmployeeCodes(dto.getEmployeeCodes());
        publicUnitDTO.setIsDeleted(dto.getIsDeleted());

        return publicUnitDTO;
    }

    public PublicUnitDTO transferEntityToPublic(Unit unit){
        PublicUnitDTO publicUnitDTO = new PublicUnitDTO();

        if (unit.getUnitName() != null && !unit.getUnitName().isEmpty()) publicUnitDTO.setUnitName(unit.getUnitName());
        if (unit.getUnitCode() != null && !unit.getUnitCode().isEmpty()) publicUnitDTO.setUnitCode(unit.getUnitCode());
        if (unit.getBoss() != null) publicUnitDTO.setBoss(employeeMapper.transferEntityToPublic(unit.getBoss()));
        if (unit.getBossTitle() != null && !unit.getBossTitle().isEmpty()) publicUnitDTO.setBossTitle(unit.getBossTitle());
        if (unit.getOrganization() != null) publicUnitDTO.setOrganization(organizationMapper.transferEntityToPublic(unit.getOrganization()));
        if (unit.getEmployees() != null && !unit.getEmployees().isEmpty())
            publicUnitDTO.setEmployeeCodes(getEmployeeCodesList(unit.getEmployees()));
        publicUnitDTO.setIsDeleted(unit.getIsDeleted());


        return publicUnitDTO;
    }

    private List<String> getEmployeeCodesList(List<Employment> employees) {
        List<String> employeeCodes = new ArrayList<>();

        for (Employment employment : employees)
            employeeCodes.add(employment.getEmployee().getAccount().getAccountCode());

        return employeeCodes;
    }

    private List<Employment> getEmploymentList(UnitDTO dto) {
        List<Employment> employmentList = new ArrayList<>();
        List<String> employeeCodes = dto.getEmployeeCodes();

        for (String code : employeeCodes){
            Employment employment = new Employment();
            Employee employee = new Employee();
            Account account = new Account();
            account.setAccountCode(code);
            employee.setAccount(account);
            employment.setEmployee(employee);

            employmentList.add(employment);
        }
        return employmentList;
    }
}
