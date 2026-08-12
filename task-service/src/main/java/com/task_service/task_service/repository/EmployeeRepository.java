package com.task_service.task_service.repository;

import com.task_service.task_service.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Employee findByAccount_AccountCodeAndOrganization_OrgCode(String accountCode, String orgCode);

    List<Employee> findByAccount_AccountID(String accountID);

    List<Employee> findByAccount_AccountCode(String accountCode);

}
