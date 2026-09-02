package com.task_service.task_service.service;

import com.task_service.task_service.dto.*;

import java.nio.file.AccessDeniedException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import jakarta.annotation.Nullable;
import org.springframework.stereotype.Service;

@Service
public interface AccountService {

    AccountDTO createAccount(AccountDTO accountDto) throws NoSuchAlgorithmException;

    AccountDTO getAccount(String accountCode);

    PublicAccountDTO viewAccount(String accountCode);

    List<AccountDTO> getAllAccounts();

    List<PublicAccountDTO> findAccount(@Nullable String accountID,@Nullable String phoneNumber);

    AccountDTO editAccount(String accountCode, AccountDTO accountDTO) throws NoSuchAlgorithmException;

    AccountDTO setAccountRole(String accountCode, String roleName);

    List<RoleDTO> getAvailableRoles();

    Boolean deleteAccount(String accountCode) throws AccessDeniedException;

    List<PublicUnitDTO> getAccountUnits(String accountID);

    List<PublicOrganizationDTO> getAccountOrganizations(String name);

    List<PublicOrganizationDTO> getOrganizationsByAccountCode(String accountCode);
}
