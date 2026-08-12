package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.*;
import com.task_service.task_service.entity.Organization;
import com.task_service.task_service.exception.EntityNotFound;
import com.task_service.task_service.mapper.AccountMapper;
import com.task_service.task_service.mapper.EmployeeMapper;
import com.task_service.task_service.mapper.OrganizationMapper;
import com.task_service.task_service.mapper.UnitMapper;
import com.task_service.task_service.repository.AccountRepository;
import com.task_service.task_service.repository.EmployeeRepository;
import com.task_service.task_service.repository.OrganizationRepository;
import com.task_service.task_service.security.ActionType;
import com.task_service.task_service.security.AuthorizationManager;
import com.task_service.task_service.service.EmployeeService;
import com.task_service.task_service.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    private OrganizationRepository repository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private OrganizationMapper mapper;
    @Autowired
    private EmployeeMapper employeeMapper;
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private UnitMapper unitMapper;
    @Autowired
    private AuthorizationManager authorizationManager;

    @Override
    @Transactional
    public OrganizationDTO createOrganization(OrganizationDTO orgDTO) throws AccessDeniedException {
        Organization organization = mapper.toEntity(orgDTO);

        setDetails(organization);
        repository.saveAndFlush(organization);

        setBoss(organization);

        repository.save(organization);

        return mapper.toDTO(organization);
    }

    private void setBoss(Organization organization) throws AccessDeniedException {
        EmployeeDTO boss = new EmployeeDTO();
        boss.setOrgCode(organization.getOrgCode());
        boss.setHiredAt(LocalDateTime.now());
        boss.setUpdateTime(LocalDateTime.now());
        boss.setIsActive(false);
        boss.setIsDeleted(false);
        AccountDTO accountDTO = accountMapper.toDTO(accountRepository.findByAccountCode(SecurityContextHolder.getContext().getAuthentication().getName()));

        boss.setAccount(accountDTO);

        EmployeeDTO createdBoss = employeeService.createEmployee(boss, true);

        organization.setBoss(employeeRepository.findByAccount_AccountCodeAndOrganization_OrgCode(createdBoss.getAccount().getAccountCode(), boss.getOrgCode()));
    }

    private void setDetails(Organization organization) {
        organization.setOrgCode(("Org_" + UUID.randomUUID()).replace("-", "_"));
        organization.setCreateTime(LocalDateTime.now());
        organization.setUpdateTime(LocalDateTime.now());
        organization.setIsDeleted(false);
    }

    @Override
    public List<PublicEmployeeDTO> getOrganizationEmployees(String orgCode) {
        Organization organization = repository.findByOrgCode(orgCode);

        return organization.getEmployees().stream()
                .map(employeeMapper::transferEntityToPublic)
                .collect(Collectors.toList());
    }

    @Override
    public OrganizationDTO getOrganizationDetails(String orgCode) throws AccessDeniedException {
        Organization organization = repository.findByOrgCode(orgCode);

        String clientCode = SecurityContextHolder.getContext().getAuthentication().getName();
        authorizationManager.checkAccess(clientCode, orgCode, organization.getBoss().getAccount().getAccountCode(), ActionType.GET_ORGANIZATION_DETAILS);

        return mapper.toDTO(organization);
    }

    @Transactional
    @Override
    public boolean deleteOrganization(String orgCode) throws AccessDeniedException {
        Organization organization = repository.findByOrgCode(orgCode);

        if (organization == null)
            throw new NullPointerException("There is no such a Organization!");

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authorizationManager.checkAccess(userDetails.getUsername(), orgCode, organization.getBoss().getAccount().getAccountCode(), ActionType.DELETE_ORGANIZATION);

        organization.setIsDeleted(true);
        repository.save(organization);

        return true;
    }

    @Override
    public OrganizationDTO changeBoss(String orgCode, String newBossCode) throws AccessDeniedException {
        Organization organization = repository.findByOrgCode(orgCode);
        String clientCode = SecurityContextHolder.getContext().getAuthentication().getName();
        authorizationManager.checkAccess(clientCode, orgCode, organization.getBoss().getAccount().getAccountCode(), ActionType.CHANGE_BOSS);

        organization.setBoss(employeeRepository.findByAccount_AccountCodeAndOrganization_OrgCode(newBossCode, orgCode));
        repository.save(organization);

        return mapper.toDTO(organization);
    }

    @Override
    public String getRoleInOrganization(String orgCode) {
        OrganizationDTO organization = mapper.toDTO(repository.findByOrgCode(orgCode));
        String clientCode = SecurityContextHolder.getContext().getAuthentication().getName();
        if (organization == null)
            throw new EntityNotFound("Organization", "Code", orgCode);

        if (clientCode.equals(organization.getBoss().getAccount().getAccountCode())) return "OWNER";
        else if (organization.getEmployeesAccountCode().contains(clientCode)) return "EMPLOYEE";
        else return "VISITOR";
    }

    @Override
    public List<PublicUnitDTO> getUnits(String orgCode) throws AccessDeniedException {
        Organization organization = repository.findByOrgCode(orgCode);
        if (organization == null)
            throw new EntityNotFound("Organization", "Organization Code", orgCode);

        String clientCode = SecurityContextHolder.getContext().getAuthentication().getName();
        authorizationManager.checkAccess(clientCode, orgCode, organization.getBoss().getAccount().getAccountCode(), ActionType.VIEW_ALL_UNITS);

        return organization.getUnits().
                stream().
                map(unitMapper :: transferEntityToPublic)
                .toList();

    }

    @Override
    public PublicOrganizationDTO getOrganizationByOrgCode(String orgCode) {
        Organization organization = repository.findByOrgCode(orgCode);
        if (organization == null)
            throw new EntityNotFound("Organization", "Organization Code", orgCode);

        return mapper.transferEntityToPublic(organization);
    }
}
