package com.task_service.task_service.repository;

import com.task_service.task_service.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {

    Unit findByUnitCode(String unitCode);

}
