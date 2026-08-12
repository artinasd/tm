package com.task_service.task_service.repository;

import com.task_service.task_service.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskStatusRepository extends JpaRepository<TaskStatus, Long> {

    TaskStatus findByTaskCode(String taskCode);

}
