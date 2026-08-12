package com.task_service.task_service.repository;

import com.task_service.task_service.entity.TaskStatusType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskStatusTypeRepository extends JpaRepository<TaskStatusType, Long> {

    TaskStatusType findByType(String type);

}
