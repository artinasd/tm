package com.task_service.task_service.mapper;

import com.task_service.task_service.dto.AccountDTO;
import com.task_service.task_service.dto.PublicAccountDTO;
import com.task_service.task_service.entity.Account;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {
    public AccountDTO toDTO(Account account) {
        AccountDTO dto = new AccountDTO();

        if (account.getAccountCode() != null && !account.getAccountCode().isEmpty()) dto.setAccountCode(account.getAccountCode());
        if (account.getAccountID() != null) dto.setAccountID(account.getAccountID());
        if (account.getAccountName() != null && !account.getAccountName().isEmpty()) dto.setAccountName(account.getAccountName());
        if (account.getFirstName() != null) dto.setFirstName(account.getFirstName());
        if (account.getLastName() != null) dto.setLastName(account.getLastName());
        if (account.getHashedPassword() != null) dto.setHashedPassword(account.getHashedPassword());
        if (account.getBio() != null && !account.getBio().isEmpty()) dto.setBio(account.getBio());
        if (account.getEmail() != null && !account.getEmail().isEmpty())dto.setEmail(account.getEmail());
        if (account.getPhoneNumber() != null) dto.setPhoneNumber(account.getPhoneNumber());
        if (account.getPicture() != null && !account.getPicture().isEmpty()) dto.setPicture(account.getPicture());
        if (account.getCreateTime() != null) dto.setCreatedTime(account.getCreateTime());
        if (account.getDateOfBirth() != null) dto.setDateOfBirth(account.getDateOfBirth());
        if (account.getChatRooms() != null && !account.getChatRooms().isEmpty()) dto.setChatRooms(account.getChatRooms());
        if (account.getLastSeen() != null) dto.setLastSeen(account.getLastSeen());
        dto.setIsActive(account.getIsActive());
        dto.setIsPrivate(account.getIsPrivate());
        dto.setIsDeleted(account.getIsDeleted());

        return dto;
    }

    public Account toEntity(AccountDTO dto) {
        Account account = new Account();

        if (dto.getAccountCode() != null && !dto.getAccountCode().isEmpty()) account.setAccountCode(dto.getAccountCode());
        if (dto.getAccountID() != null) account.setAccountID(dto.getAccountID());
        if (dto.getAccountName() != null && !dto.getAccountName().isEmpty())account.setAccountName(dto.getAccountName());
        if (dto.getHashedPassword() != null && !dto.getHashedPassword().isEmpty()) account.setHashedPassword(dto.getHashedPassword());
        if (dto.getFirstName() != null) account.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) account.setLastName(dto.getLastName());
        if (dto.getBio() != null && !dto.getBio().isEmpty()) account.setBio(dto.getBio());
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) account.setEmail(dto.getEmail());
        if (dto.getPhoneNumber() != null) account.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getPicture() != null && !dto.getPicture().isEmpty()) account.setPicture(dto.getPicture());
        if (dto.getCreatedTime() != null) account.setCreateTime(dto.getCreatedTime());
        if (dto.getDateOfBirth() != null) account.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getChatRooms() != null && !dto.getChatRooms().isEmpty()) account.setChatRooms(dto.getChatRooms());
        if (dto.getLastSeen() != null) account.setLastSeen(dto.getLastSeen());
        account.setIsActive(dto.getIsActive());
        account.setIsPrivate(dto.getIsPrivate());
        account.setIsDeleted(dto.getIsDeleted());

        return account;
    }

    public PublicAccountDTO transferDTOToPublicDTO(AccountDTO dto){
        PublicAccountDTO publicAccountDTO = new PublicAccountDTO();

        if (dto.getAccountID() != null && !dto.getAccountID().isEmpty()) publicAccountDTO.setAccountID(dto.getAccountID());
        if (dto.getAccountCode() != null && !dto.getAccountCode().isEmpty()) publicAccountDTO.setAccountCode(dto.getAccountCode());
        if (dto.getAccountName() != null && !dto.getAccountName().isEmpty()) publicAccountDTO.setAccountName(dto.getAccountName());
        if (dto.getBio() != null && !dto.getBio().isEmpty()) publicAccountDTO.setBio(dto.getBio());
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) publicAccountDTO.setEmail(dto.getEmail());
        if (dto.getPicture() != null && !dto.getPicture().isEmpty()) publicAccountDTO.setPicture(dto.getPicture());
        if (dto.getDateOfBirth() != null) publicAccountDTO.setDateOfBirth(dto.getDateOfBirth()) ;
        if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isEmpty()) publicAccountDTO.setPhoneNumber(dto.getPhoneNumber());
        publicAccountDTO.setIsPrivate(dto.getIsPrivate());
        if (!dto.getIsPrivate()) {
            if (dto.getLastSeen() != null) publicAccountDTO.setLastSeen(dto.getLastSeen());
            publicAccountDTO.setIsActive(dto.getIsActive());
            publicAccountDTO.setIsDeleted(dto.getIsDeleted());
        }

        return publicAccountDTO;
    }
    public PublicAccountDTO transferEntityToPublicDTO(Account account){
        PublicAccountDTO publicAccountDTO = new PublicAccountDTO();

        if (account.getAccountID() != null && !account.getAccountID().isEmpty()) publicAccountDTO.setAccountID(account.getAccountID());
        if (account.getAccountCode() != null && !account.getAccountCode().isEmpty()) publicAccountDTO.setAccountCode(account.getAccountCode());
        if (account.getAccountName() != null && !account.getAccountName().isEmpty()) publicAccountDTO.setAccountName(account.getAccountName());
        if (account.getBio() != null && !account.getBio().isEmpty()) publicAccountDTO.setBio(account.getBio());
        if (account.getEmail() != null && !account.getEmail().isEmpty()) publicAccountDTO.setEmail(account.getEmail());
        if (account.getPicture() != null && !account.getPicture().isEmpty()) publicAccountDTO.setPicture(account.getPicture());
        if (account.getDateOfBirth() != null) publicAccountDTO.setDateOfBirth(account.getDateOfBirth()) ;
        if (account.getPhoneNumber() != null && !account.getPhoneNumber().isEmpty()) publicAccountDTO.setPhoneNumber(account.getPhoneNumber());
        publicAccountDTO.setIsPrivate(account.getIsPrivate());
        if (!account.getIsPrivate()) {
            if (account.getLastSeen() != null) publicAccountDTO.setLastSeen(account.getLastSeen());
            publicAccountDTO.setIsActive(account.getIsActive());
            publicAccountDTO.setIsDeleted(account.getIsDeleted());
        }

        return publicAccountDTO;
    }
}
