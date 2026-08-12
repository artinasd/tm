package com.task_service.task_service.repository;

import com.task_service.task_service.entity.WorkTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkTimeRepository extends JpaRepository<WorkTime, Long> {

    WorkTime findByWorkTimeCode(String workTimeCode);

}
