package com.task_service.task_service.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String accountCode;

    @Column(nullable = false, unique = true)
    private String accountID;

    @Column(nullable = false)
    private String accountName;

    @Column(nullable = false)
    private String hashedPassword;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    private String bio;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column
    private String picture;

    @Column(nullable = false)
    private LocalDateTime createTime;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column
    private Boolean isActive;

    @Column(nullable = false)
    private LocalDateTime lastSeen;

    @Column
    private Boolean isPrivate;

    @Column
    private Boolean isDeleted;

    @OneToMany(mappedBy = "account")
    private List<Membership> chatRooms;
}
