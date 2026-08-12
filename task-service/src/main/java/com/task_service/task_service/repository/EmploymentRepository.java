package com.task_service.task_service.repository;

import com.task_service.task_service.entity.Account;
import com.task_service.task_service.entity.Employment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmploymentRepository extends JpaRepository<Employment, Long> {

    Employment findByUnit_UnitCodeAndEmployee_Account_AccountCode(String unitCode, String accountCode);

    List<Employment> findByEmployee_Account(Account account);

    List<Employment> findByEmployee_Account_AccountCodeAndEmployee_Organization_OrgCode(String accountCode, String orgCode);

}
