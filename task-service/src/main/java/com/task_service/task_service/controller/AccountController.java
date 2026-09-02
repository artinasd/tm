package com.task_service.task_service.controller;

import com.task_service.task_service.dto.*;
import com.task_service.task_service.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.NoSuchAlgorithmException;
import java.text.MessageFormat;
import java.util.List;

@RestController
@RequestMapping("api/accounts")
public class AccountController {

    @Autowired
    private AccountService service;

    @PostMapping("add")
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO dto) throws NoSuchAlgorithmException {
        AccountDTO publicUser = service.createAccount(dto);
        return new ResponseEntity<>(publicUser, HttpStatus.CREATED);
    }

    @GetMapping("profile")
    public ResponseEntity<AccountDTO> getAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDTO accountDTO = service.getAccount(authentication.getName());
        if (accountDTO == null) return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(accountDTO, HttpStatus.OK);
    }

    @GetMapping("listAll")
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        List<AccountDTO> userDTOList = service.getAllAccounts();
        return new ResponseEntity<>(userDTOList, HttpStatus.OK);
    }

    @GetMapping("units")
    public ResponseEntity<List<PublicUnitDTO>> getAccountUnits(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return new ResponseEntity<>(service.getAccountUnits(authentication.getName()), HttpStatus.OK);
    }

    @GetMapping("view/{accountCode}/orgs")
    public ResponseEntity<List<PublicOrganizationDTO>> getOrganizationsByAccountID(@PathVariable String accountCode){
        return new ResponseEntity<>(service.getOrganizationsByAccountCode(accountCode), HttpStatus.OK);
    }

    @GetMapping("findAccount")
    public ResponseEntity<List<PublicAccountDTO>> findAccount(@RequestParam(required = false) String accountID,
                                                              @RequestParam(required = false) String phoneNumber){
        return new ResponseEntity<>(service.findAccount(accountID, phoneNumber), HttpStatus.OK);
    }

    @GetMapping("view/{accountCode}")
    public ResponseEntity<PublicAccountDTO> viewAccount(@PathVariable String accountCode){
        return new ResponseEntity<>(service.viewAccount(accountCode), HttpStatus.OK);
    }

    @PatchMapping("edit")
    public ResponseEntity<AccountDTO> editAccount(@RequestBody AccountDTO dto) throws NoSuchAlgorithmException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDTO updatedUserDTO = service.editAccount(authentication.getName(), dto);
        if (updatedUserDTO == null) return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(updatedUserDTO, HttpStatus.OK);
    }

    @PatchMapping("role")
    public ResponseEntity<AccountDTO> setAccountRole(@RequestBody RoleDTO roleDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return new ResponseEntity<>(service.setAccountRole(authentication.getName(), roleDTO.getName()), HttpStatus.OK);
    }

    @DeleteMapping("delete")
    public ResponseEntity<String> deleteAccount(@PathVariable("accountCode") String accountCode) throws AccessDeniedException {
        String message;
        Boolean deleteResult = service.deleteAccount(accountCode);
        if (!deleteResult) {
            message = MessageFormat.format("Account[{0}] not found.", accountCode);
            return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
        }
        message = MessageFormat.format("Account[{0}] deleted successfully.", accountCode);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
