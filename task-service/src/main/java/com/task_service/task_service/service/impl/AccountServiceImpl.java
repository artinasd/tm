package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.*;
import com.task_service.task_service.entity.*;
import com.task_service.task_service.exception.EntityNotFound;
import com.task_service.task_service.mapper.AccountMapper;
import com.task_service.task_service.mapper.OrganizationMapper;
import com.task_service.task_service.mapper.UnitMapper;
import com.task_service.task_service.repository.EmployeeRepository;
import com.task_service.task_service.repository.EmploymentRepository;
import com.task_service.task_service.repository.OrganizationRepository;
import com.task_service.task_service.security.ActionType;
import com.task_service.task_service.security.AuthorizationManager;
import com.task_service.task_service.service.AccountService;
import com.task_service.task_service.repository.AccountRepository;

import java.nio.file.AccessDeniedException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.task_service.task_service.utility.PasswordHasher.Hash;
import com.task_service.task_service.utility.PasswordHasher.SHA256;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private EmploymentRepository employmentRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private AccountMapper mapper;
    @Autowired
    private OrganizationMapper organizationMapper;
    @Autowired
    private UnitMapper unitMapper;
    @Autowired
    private AuthorizationManager authorizationManager;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PersistenceContext
    private EntityManager manager;

    private final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

    private final Hash sha256 = new SHA256();


    @Override
    @Transactional
    public AccountDTO createAccount(AccountDTO accountDTO) throws NoSuchAlgorithmException {
        Account account = mapper.toEntity(accountDTO);

        setDetails(account, accountDTO);

        accountRepository.save(account);

        logger.info("{}" , account);

        broadCastInitializeMessages(account.getAccountCode());

        return mapper.toDTO(account);
    }

    private void broadCastInitializeMessages(String accountCode) {
        messagingTemplate.convertAndSendToUser(accountCode, "queue/tasks", "Initial message to task queue!");
        messagingTemplate.convertAndSendToUser(accountCode, "queue/messages", "Initial message to task queue!");
    }

    private void setDetails(Account account, AccountDTO accountDTO) throws NoSuchAlgorithmException {
        String hashedPassword = sha256.hash(accountDTO.getHashedPassword());
        account.setHashedPassword(hashedPassword);

        account.setCreateTime(LocalDateTime.now());

        account.setAccountCode(("Account_" + UUID.randomUUID()).replace("_", "-"));

        account.setIsActive(true);

        account.setIsDeleted(false);

        account.setIsPrivate(false);

        account.setLastSeen(LocalDateTime.now());
    }

    @Override
    public AccountDTO getAccount(String accountCode) {
        Account account = accountRepository.findByAccountCode(accountCode);

        if (account != null) {
            return mapper.toDTO(account);
        }
        return null;
    }

    @Override
    public PublicAccountDTO viewAccount(String accountCode) {
        Account account = accountRepository.findByAccountCode(accountCode);

        if (account == null)
            throw new EntityNotFound("Account", "Account Code", accountCode);

        return mapper.transferEntityToPublicDTO(account);
    }

    @Override
    public List<AccountDTO> getAllAccounts() {

        List<Account> accountList = accountRepository.findAll();

        return new ArrayList<>(accountList.stream().map(mapper::toDTO).toList());
    }

    @Override
    public List<PublicAccountDTO> findAccount(@Nullable String accountID, @Nullable String phoneNumber) {
        Boolean nullAccountID = (accountID == null || accountID.isEmpty());
        Boolean nullPhoneNumber = (phoneNumber == null || phoneNumber.isEmpty());

        if (nullAccountID && nullPhoneNumber)
            return new ArrayList<>();

        CriteriaBuilder builder = manager.getCriteriaBuilder();
        CriteriaQuery<Account> criteriaQuery = builder.createQuery(Account.class);
        Root<Account> accountRoot = criteriaQuery.from(Account.class);
        List<Predicate> predicates = new ArrayList<>();

        if (!nullAccountID)
            predicates.add(builder.like(accountRoot.get("accountID"), "%" + accountID.toLowerCase() + "%"));
        if (!nullPhoneNumber)
            predicates.add(builder.like(accountRoot.get("phoneNumber"), "%" + phoneNumber.toLowerCase() + "%"));

        criteriaQuery.where(builder.and(predicates.toArray(new Predicate[0])));

        return manager.createQuery(criteriaQuery).getResultList()
                .stream()
                .map(mapper::transferEntityToPublicDTO)
                .toList();
    }

    @Override
    public List<PublicUnitDTO> getAccountUnits(String accountID) {
        Account account = accountRepository.findByAccountID(accountID);
        if (account == null){
            throw new EntityNotFound("Account", "ID", accountID);
        }
        List<Employment> employments = employmentRepository.findByEmployee_Account(account);
        List<Unit> unitList = new ArrayList<>();

        for (Employment employment : employments)
            unitList.add(employment.getUnit());

        return unitList.stream()
                .map(unitMapper::transferEntityToPublic)
                .collect(Collectors.toList());
    }

    @Override
    public List<PublicOrganizationDTO> getAccountOrganizations(String accountID) {
        List<Employee> employees = employeeRepository.findByAccount_AccountID(accountID);
        List<Organization> organizationList = new ArrayList<>();

        for (Employee employee : employees)
            organizationList.add(employee.getOrganization());

        return organizationList.stream()
                .map(organizationMapper::transferEntityToPublic)
                .collect(Collectors.toList());
    }

    @Override
    public List<PublicOrganizationDTO> getOrganizationsByAccountCode(String accountCode) {
        Account account = accountRepository.findByAccountCode(accountCode);

        if (account == null)
            throw new EntityNotFound("Account", "Account Code", accountCode);

        List<Employee> employeeList = employeeRepository.findByAccount_AccountCode(accountCode);
        List<Organization> organizations = new ArrayList<>();

        for (Employee employee : employeeList)
            organizations.add(employee.getOrganization());

        return organizations.stream()
                .map(organizationMapper::transferEntityToPublic)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AccountDTO editAccount(String accountCode, AccountDTO accountDTO) throws NoSuchAlgorithmException {
        Account account = accountRepository.findByAccountCode(accountCode);
        if (account == null) {
            throw  new EntityNotFound("Account", "ID", accountCode);
        }
        updateEntityFromDTO(account, accountDTO);

        Account updatedAccount = accountRepository.save(account);

        return mapper.toDTO(updatedAccount);
    }

    private void updateEntityFromDTO(Account account, AccountDTO dto) throws NoSuchAlgorithmException {

        if (dto.getAccountID() != null) account.setAccountID(dto.getAccountID());
        if (dto.getAccountName() != null && !dto.getAccountName().isEmpty()) account.setAccountName(dto.getAccountName());
        if (dto.getHashedPassword() != null && !dto.getHashedPassword().isEmpty()) {
            String hashedPassword = sha256.hash(dto.getHashedPassword()); // TODO : it should be done with authentication
            account.setHashedPassword(hashedPassword);
        }
        if (dto.getFirstName() != null && !dto.getFirstName().isEmpty()) account.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null && !dto.getLastName().isEmpty()) account.setLastName(dto.getLastName());
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) account.setEmail(dto.getEmail());
        if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isEmpty()) account.setPhoneNumber(dto.getPhoneNumber()); // TODO : it should be done with authentication
        if (dto.getPicture() != null && !dto.getPicture().isEmpty()) account.setPicture(dto.getPicture());
        if (dto.getBio() != null && !dto.getBio().isEmpty()) account.setBio(dto.getBio());
        if (dto.getDateOfBirth() != null) account.setDateOfBirth(dto.getDateOfBirth());
    }

    @Override
    @Transactional
    public Boolean deleteAccount(String accountCode) throws AccessDeniedException {
        Account account = accountRepository.findByAccountID(accountCode);

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        authorizationManager.checkAccess(userDetails.getUsername(), null, accountCode, ActionType.DELETE_ACCOUNT);

        if (account == null) {
            throw new EntityNotFound("Account", "ID", accountCode);
        }
        accountRepository.delete(account);
        return true;
    }

}
