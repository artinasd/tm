package com.task_service.task_service.repository;

import com.task_service.task_service.entity.LinkType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LinkTypeRepository extends JpaRepository<LinkType, Long> {

    LinkType findByType(String type);

}
