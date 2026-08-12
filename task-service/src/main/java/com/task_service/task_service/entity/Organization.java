package com.task_service.task_service.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "orgCode")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String orgCode;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @Column
    private String logoUrl;

    @Column(nullable = false)
    private LocalDateTime createTime;

    @Column
    private LocalDateTime updateTime;

    @Column
    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn
    private Employee Boss;

    @OneToMany(mappedBy = "organization")
    private List<Unit> units;

    @OneToMany(mappedBy = "organization")
    private List<Employee> employees;

}
