package com.task_service.task_service.repository;

import com.task_service.task_service.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Task findByTaskCode(String taskCode);

    @Query(value = " SELECT * FROM task WHERE parentTask = :parentTask AND taskCode != :exclude", nativeQuery = true)
    List<Task> findSiblingsByParentTask(@Param("parentTask") String parentTask, @Param("taskCode") String exclude);

    @Query(value = """ 
            SELECT t FROM task t
            JOIN t.responsible r
            JOIN r.employee e
            JOIN e.account a
            JOIN t.taskStatus ts
            JOIN ts.taskStatusType tst
            WHERE a.accountCode = :accountCode AND tst.type = :type
            """, nativeQuery = true)
    List<Task> findAccountsTasks(@Param("accountCode") String accountCode, @Param("type") String status);
}
