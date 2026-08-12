package com.task_service.task_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table
@NoArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDateTime hiredAt;

    @Column
    private LocalDateTime updateTime;

    @Column
    private Boolean isActive;

    @Column
    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Organization organization;

    @OneToMany(mappedBy = "employee")
    private List<Employment> employments;
}
