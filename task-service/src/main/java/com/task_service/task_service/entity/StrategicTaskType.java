package com.task_service.task_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
public class StrategicTaskType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String type;
}
