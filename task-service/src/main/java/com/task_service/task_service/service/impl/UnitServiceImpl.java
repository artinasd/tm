package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.*;
import com.task_service.task_service.entity.Employment;
import com.task_service.task_service.entity.Unit;
import com.task_service.task_service.exception.EntityNotFound;
import com.task_service.task_service.mapper.*;
import com.task_service.task_service.repository.*;
import com.task_service.task_service.security.ActionType;
import com.task_service.task_service.security.AuthorizationManager;
import com.task_service.task_service.service.EmploymentService;
import com.task_service.task_service.service.UnitService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.nio.file.AccessDeniedException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UnitServiceImpl implements UnitService {

    @Autowired
    private UnitRepository repository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private EmploymentRepository employmentRepository;
    @Autowired
    private OrganizationRepository orgRepository;
    @Autowired
    private EmploymentService employmentService;
    @Autowired
    private UnitMapper mapper;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private EmployeeMapper employeeMapper;
    @Autowired
    private EmploymentMapper employmentMapper;
    @Autowired
    private AuthorizationManager authorizationManager;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    @Override
    public UnitDTO createUnit(UnitDTO unitDTO) {
        Unit unit = mapper.toEntity(unitDTO);

        setDetails(unit, unitDTO);

        repository.save(unit);

        return mapper.toDTO(unit);
    }

    @Transactional
    private void setDetails(Unit unit, UnitDTO dto) {
        unit.setCreateTime(LocalDateTime.now());

        /* LinkDTO linkRequest = new LinkDTO();
        linkRequest.setChatRoom(ChatRoomMapper.toDTO(unit));
        linkRepository.save(linkGenerator.createLink(linkRequest));
        TODO : set this link
         */
        unit.setBoss(employeeRepository.findByAccount_AccountCodeAndOrganization_OrgCode(unit.getBoss().getAccount().getAccountCode(), unit.getOrganization().getOrgCode()));

        unit.setOrganization(orgRepository.findByOrgCode(unit.getOrganization().getOrgCode()));

        String unitCode = "Unit_" + UUID.randomUUID();
        unitCode = unitCode.replace("-", "_");
        unit.setUnitCode(unitCode);

        unit.setCreateTime(LocalDateTime.now());

        if (dto.getParentUnitCode() != null && !dto.getParentUnitCode().isEmpty())
            unit.setUnitPath(dto.getParentUnitCode() + "." + unit.getUnitCode());
        else
            unit.setUnitPath(unit.getUnitCode());

        // TODO : Employees will be added after creating the unit
    }

    @Override
    public PublicUnitDTO getUnitByUnitCode(String unitCode) {
        Unit unit = repository.findByUnitCode(unitCode);
        return mapper.transferEntityToPublic(unit);
    }

    @Override
    public List<PublicUnitDTO> searchUnit(String unitName, String unitCode, String orgName) {

        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Unit> criteriaQuery = criteriaBuilder.createQuery(Unit.class);
        Root<Unit> root = criteriaQuery.from(Unit.class);
        List<Predicate> predicates = new ArrayList<>();

        if (unitName != null && !unitName.isEmpty())
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("unitName")), "%" + unitName.toLowerCase() + "%"));
        if (unitCode != null && !unitCode.isEmpty())
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("unitCode")), "%" + unitCode.toLowerCase() + "%"));
        if (orgName != null && !orgName.isEmpty())
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("organization").get("title")), "%" + orgName.toLowerCase() + "%"));

        criteriaQuery.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));

        return entityManager.createQuery(criteriaQuery).getResultList()
                .stream()
                .map(mapper::transferEntityToPublic)
                .collect(Collectors.toList());
    }

    @Override
    public UnitDTO getUnitDetails(String unitCode) throws AccessDeniedException {
        Unit unit = repository.findByUnitCode(unitCode);

        String clientID = SecurityContextHolder.getContext().getAuthentication().getName();
        authorizationManager.checkAccess(clientID, unitCode, unit.getBoss().getAccount().getAccountCode(), ActionType.VIEW_UNIT);

        return mapper.toDTO(unit);
    }

    @Override
    public UnitDTO editUnit(String unitCode, UnitDTO unitDTO) {
        Unit unit = repository.findByUnitCode(unitCode);

        updateEntity(unit, unitDTO);

        repository.save(unit);

        return mapper.toDTO(unit);
    }

    @Override
    public boolean removeEmployee(String accountCode, String unitCode) throws AccessDeniedException {
        String clientID = SecurityContextHolder.getContext().getAuthentication().getName();
        Unit unit = repository.findByUnitCode(unitCode);
        authorizationManager.checkAccess(clientID, unitCode, accountCode, ActionType.DELETE_EMPLOYMENT);

        Employment employment = employmentRepository.findByUnit_UnitCodeAndEmployee_Account_AccountCode(unitCode, accountCode);

        return unit.getEmployees().remove(employment);
    }

    private void updateEntity(Unit unit, UnitDTO unitDTO) {
        if (unitDTO.getUnitName() != null && !unitDTO.getUnitName().isEmpty()) unit.setUnitName(unitDTO.getUnitName());
        if (unitDTO.getBossTitle() != null && !unitDTO.getBossTitle().isEmpty()) unit.setBossTitle(unitDTO.getBossTitle());
        if (unitDTO.getBoss() != null) unit.setBoss(employeeRepository.findByAccount_AccountCodeAndOrganization_OrgCode(unitDTO.getBoss().getAccount().getAccountCode(), unitDTO.getOrganization().getOrgCode()));
        // This feature exist to change the parent Unit without losing data(deleting and creating new unit with different parent)
        if (unitDTO.getParentUnitCode() != null && !unitDTO.getParentUnitCode().isEmpty()){
            Unit parentUnit = repository.findByUnitCode(unitDTO.getParentUnitCode());
            unit.setUnitPath(parentUnit.getUnitPath() + "." + parentUnit.getId());
        }
        /* createTime and creator could not be changed
         * members could not be changed and for adding member or joining a member there will be some methods in future
         */
    }

    @Override
    public void deleteUnit(String unitCode) {
        Unit unit = repository.findByUnitCode(unitCode);
        repository.deleteById(unit.getId());
    }

    @org.springframework.transaction.annotation.Transactional
    @Override
    public List<PublicEmploymentDTO> addEmployee(String unitCode, List<PublicEmployeeDTO> employees) throws AccessDeniedException {
        Unit unit = repository.findByUnitCode(unitCode);
        if (unit == null)
            throw new EntityNotFound("Unit", "UnitCode", unitCode);

        List<Employment> employmentList = unit.getEmployees();

        for (PublicEmployeeDTO employee : employees){
            EmploymentDTO employmentDTO = new EmploymentDTO();
            employmentDTO.setEmployee(employeeMapper.toDTO(
                    employeeRepository.findByAccount_AccountCodeAndOrganization_OrgCode(
                            employee.getAccount().getAccountCode(),
                            unit.getOrganization().getOrgCode()
                    )
            ));
            employmentDTO.setUnit(mapper.toDTO(repository.findByUnitCode(unitCode)));
            // TODO: Set the Role

            employmentDTO = employmentService.createEmployment(employmentDTO);

            employmentList.add(employmentMapper.toEntity(employmentDTO));
        }

        return employmentList.stream()
                .map(employmentMapper::transferEntityToPublic)
                .collect(Collectors.toList());
    }

    // TODO : join with link method implementation
}
