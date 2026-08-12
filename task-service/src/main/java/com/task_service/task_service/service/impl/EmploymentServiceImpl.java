package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.EmploymentDTO;
import com.task_service.task_service.dto.PublicEmploymentDTO;
import com.task_service.task_service.entity.Employment;
import com.task_service.task_service.entity.Unit;
import com.task_service.task_service.exception.EntityNotFound;
import com.task_service.task_service.mapper.EmployeeMapper;
import com.task_service.task_service.mapper.EmploymentMapper;
import com.task_service.task_service.repository.EmployeeRepository;
import com.task_service.task_service.repository.EmploymentRepository;
import com.task_service.task_service.repository.RoleRepository;
import com.task_service.task_service.repository.UnitRepository;
import com.task_service.task_service.security.ActionType;
import com.task_service.task_service.security.AuthorizationManager;
import com.task_service.task_service.service.EmploymentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmploymentServiceImpl implements EmploymentService {

    @Autowired
    private EmploymentRepository repository;
    @Autowired
    private EmploymentMapper mapper;
    @Autowired
    private UnitRepository unitRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private EmployeeMapper employeeMapper;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuthorizationManager authorizationManager;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public EmploymentDTO createEmployment(EmploymentDTO employmentDTO) throws AccessDeniedException {
        Employment employment = mapper.toEntity(employmentDTO);

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authorizationManager.checkAccess(userDetails.getUsername(), employment.getUnit().getUnitCode(), employment.getUnit().getBoss().getAccount().getAccountCode(), ActionType.CREATE_EMPLOYMENT);

        setDetails(employment);

        repository.save(employment);

        return mapper.toDTO(employment);
    }

    private void setDetails(Employment employment) {
        employment.setUnit(unitRepository.findByUnitCode(employment.getUnit().getUnitCode())); // Setting Unit to employment
        employment.setEmployee(employeeRepository.findByAccount_AccountCodeAndOrganization_OrgCode(employment.getEmployee().getAccount().getAccountCode(), employment.getUnit().getOrganization().getOrgCode()));
        employment.setJoinTime(LocalDateTime.now());
        // TODO : Set Role
    }

    @Override
    public List<PublicEmploymentDTO> getEmploymentsByUnitCode(String UnitCode) {
        Unit unit = unitRepository.findByUnitCode(UnitCode);

        return unit.getEmployees().stream()
                .map(mapper::transferEntityToPublic)
                .collect(Collectors.toList());
    }

    @Override
    public List<PublicEmploymentDTO> searchEmployments(String UnitCode, String accountId, String accountName) {
        List<PublicEmploymentDTO> publicEmploymentDTOS = new ArrayList<>();

        Unit unit = unitRepository.findByUnitCode(UnitCode);
        if (unit == null) throw new NullPointerException("There is no such a unit!");

        for (Employment employee : unit.getEmployees())
            if (employee.getEmployee().getAccount().getAccountName().toLowerCase().contains(accountName.toLowerCase())
                    || employee.getEmployee().getAccount().getAccountID().contains(accountId))
                publicEmploymentDTOS.add(mapper.transferEntityToPublic(employee));

        return publicEmploymentDTOS;
    }

    @Transactional
    @Override
    public Boolean promoteEmployment(String UnitCode, String accountCode) throws AccessDeniedException {
        Employment employment = repository.findByUnit_UnitCodeAndEmployee_Account_AccountCode(UnitCode, accountCode);

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authorizationManager.checkAccess(userDetails.getUsername(), employment.getUnit().getUnitCode(), employment.getUnit().getBoss().getAccount().getAccountCode(), ActionType.PROMOTE_EMPLOYMENT);

        //TODO : do a promote

        return true;
    }

    @Transactional
    @Override
    public Boolean leaveUnit(String unitCode, String accountCode) {
        boolean found = false;
        Unit unit = unitRepository.findByUnitCode(unitCode);

        if (unit == null)
            throw new EntityNotFound("Unit", "Code", unitCode);

        List<Employment> employeesList = unit.getEmployees();

        for (Employment employment : employeesList)
            if (employment.getEmployee().getAccount().getAccountCode().equals(accountCode)){
                employeesList.remove(employment);
                found = true;
            }

        return found;
    }
}
