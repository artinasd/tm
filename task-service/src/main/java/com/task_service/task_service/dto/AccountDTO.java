package com.task_service.task_service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountDTO {
    private Long id;
    private String accountCode;
    private String accountID;
    private String accountName;
    private String hashedPassword;
    private String firstName;
    private String lastName;
    private String bio;
    private String email;
    private String phoneNumber;
    private String picture;
    private LocalDateTime createdTime;
    private LocalDate dateOfBirth;
    private Boolean isActive;
    private LocalDateTime lastSeen;
    private Boolean isPrivate;
    private Boolean isDeleted;
}
