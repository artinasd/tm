package com.task_service.task_service.repository;

import com.task_service.task_service.entity.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.net.URL;

@Repository
public interface LinkRepository extends JpaRepository<Link, Long> {
    Link findByUrl(URL url);
}
