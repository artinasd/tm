package com.task_service.task_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table
@NoArgsConstructor
public class Employment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn
    private Employee employee;

    @Column(nullable = false)
    private LocalDateTime joinTime;

    @Column
    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn
    private Role role; // TODO : change it to Org.Role

    @ManyToOne
    @JoinColumn(nullable = false)
    private Unit unit;

}
