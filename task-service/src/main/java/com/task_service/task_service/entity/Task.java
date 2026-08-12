package com.task_service.task_service.entity;

import com.task_service.task_service.dto.LTreeType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String taskCode;

    @Column(nullable = false)
    private String title;

    @Column
    private String description;

    @Column(nullable = false)
    private LocalDateTime createTime;

    @Column
    private LocalDateTime startTime;

    @Column
    private LocalDateTime endTime;

    @Column
    private LocalDateTime deadline;

    @Column
    private Long workMinutes;

    @Column
    private LocalDateTime updateTime;

    @Column
    private LocalDateTime pinDate;

    @Column
    private int taskWeight;

    @Column
    private String priority;

    @Column
    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private Employment owner;

    @ManyToOne
    @JoinColumn(name = "responsible_id")
    private Employment responsible;

    @ManyToOne
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @ManyToOne
    @JoinColumn(nullable = false)
    private TaskStatus taskStatus;

    @ElementCollection
    private List<TaskStatus> taskStatusHistory;

    @Type(LTreeType.class)
    @Column(columnDefinition = "ltree")
    private String taskPath;

}
