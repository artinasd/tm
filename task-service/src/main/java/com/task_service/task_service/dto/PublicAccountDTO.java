package com.task_service.task_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class PublicAccountDTO {
    private String accountCode;
    private String accountID;
    private String accountName;
    private String bio;
    private String email;
    private String phoneNumber;
    private String picture;
    private LocalDate dateOfBirth;
    private Boolean isActive;
    private LocalDateTime lastSeen;
    private Boolean isPrivate;
    private Boolean isDeleted;
}
