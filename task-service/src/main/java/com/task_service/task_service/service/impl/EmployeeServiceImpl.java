package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.EmployeeDTO;
import com.task_service.task_service.dto.PublicEmployeeDTO;
import com.task_service.task_service.dto.PublicEmploymentDTO;
import com.task_service.task_service.entity.Employee;
import com.task_service.task_service.entity.Employment;
import com.task_service.task_service.mapper.EmployeeMapper;
import com.task_service.task_service.repository.AccountRepository;
import com.task_service.task_service.repository.EmployeeRepository;
import com.task_service.task_service.repository.EmploymentRepository;
import com.task_service.task_service.repository.OrganizationRepository;
import com.task_service.task_service.security.ActionType;
import com.task_service.task_service.security.AuthorizationManager;
import com.task_service.task_service.service.EmployeeService;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeMapper mapper;
    @Autowired
    private EmployeeRepository repository;
    @Autowired
    private OrganizationRepository orgRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private EmploymentRepository employmentRepository;

    @Autowired
    private AuthorizationManager authorizationManager;
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO, @Nullable Boolean initial) throws AccessDeniedException {
        if (initial == null){
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            authorizationManager.checkAccess(userDetails.getUsername(), employeeDTO.getOrgCode(), orgRepository.findByOrgCode(employeeDTO.getOrgCode()).getBoss().getAccount().getAccountCode(), ActionType.CREATE_EMPLOYEE);
        }

        Employee employee = mapper.toEntity(employeeDTO);

        setDetails(employee);

        employee = repository.save(employee);

        return mapper.toDTO(employee);
    }

    private void setDetails(Employee employee) {
        employee.setOrganization(orgRepository.findByOrgCode(employee.getOrganization().getOrgCode()));
        employee.setAccount(accountRepository.findByAccountCode(employee.getAccount().getAccountCode()));
        employee.setIsActive(true);
    }

    @Override
    public PublicEmployeeDTO getEmployeeByAccountCodeAndOrgCode(String accountCode, String orgCode) {
        Employee employee = repository.findByAccount_AccountCodeAndOrganization_OrgCode(accountCode, orgCode);

        if (employee != null)
            return mapper.transferEntityToPublic(employee);

        return null;
    }

    @Override
    public List<PublicEmployeeDTO> searchEmployees(String firstName, String lastName) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Employee> criteriaQuery = criteriaBuilder.createQuery(Employee.class);
        Root<Employee> employeeRoot = criteriaQuery.from(Employee.class);
        List<Predicate> predicates = new ArrayList<>();

        if (firstName != null && !firstName.isEmpty())
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(employeeRoot.get("account").get("firstName")), "%" + firstName.toLowerCase() + "%"));

        if (lastName != null && !lastName.isEmpty())
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(employeeRoot.get("account").get("lastName")), "%" + lastName.toLowerCase() + "%"));

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));

        return entityManager.createQuery(criteriaQuery).getResultList()
                .stream()
                .map(mapper :: transferEntityToPublic)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO getEmployeeDetails(PublicEmployeeDTO employeeDTO, PublicEmploymentDTO client) {
        EmployeeDTO requested = new EmployeeDTO();

        // TODO: We need to do authorization, but we need the currest role and unit that client has when it sends the request

        return requested;
    }

    @Override
    @Transactional
    public EmployeeDTO editEmployee(EmployeeDTO employeeDTO) throws AccessDeniedException {
        Employee employee = repository.findByAccount_AccountCodeAndOrganization_OrgCode(employeeDTO.getAccount().getAccountCode(), employeeDTO.getOrgCode());

        if (employee == null) throw new NullPointerException("There is no such a employee!");

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authorizationManager.checkAccess(userDetails.getUsername(), employeeDTO.getOrgCode(), employee.getOrganization().getBoss().getAccount().getAccountCode(), ActionType.EDIT_EMPLOYEE);

        updateEntity(employee, employeeDTO);

        employee = repository.save(employee);

        return mapper.toDTO(employee);
    }

    private void updateEntity(Employee employee, EmployeeDTO employeeDTO) {
        if (employeeDTO.getIsActive() != null) employee.setIsActive(employeeDTO.getIsActive());
        if (employeeDTO.getOrgCode() != null) employee.setOrganization(orgRepository.findByOrgCode(employeeDTO.getOrgCode()));
        if (employeeDTO.getHiredAt() != null) employee.setHiredAt(employeeDTO.getHiredAt());
        employee.setUpdateTime(LocalDateTime.now());
    }

    @Override
    public boolean deleteEmployee(EmployeeDTO employeeDTO) throws AccessDeniedException {
        Employee employee = repository.findByAccount_AccountCodeAndOrganization_OrgCode(employeeDTO.getAccount().getAccountCode(), employeeDTO.getOrgCode());

        if (employee == null) throw new NullPointerException("There is no such a employee!");

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authorizationManager.checkAccess(userDetails.getUsername(), employeeDTO.getOrgCode(), employee.getOrganization().getBoss().getAccount().getAccountCode(), ActionType.DELETE_EMPLOYEE);

        List<Employment> employments =
                employmentRepository.findByEmployee_Account_AccountCodeAndEmployee_Organization_OrgCode(
                        employeeDTO.getAccount().getAccountCode(),
                        employeeDTO.getOrgCode());

        for (Employment employment : employments)
            employmentRepository.delete(employment);

        repository.delete(employee);
        return true;
    }
}
