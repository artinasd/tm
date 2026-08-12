package com.task_service.task_service.service;

import com.task_service.task_service.dto.EmployeeDTO;
import com.task_service.task_service.dto.PublicEmployeeDTO;
import com.task_service.task_service.dto.PublicEmploymentDTO;
import jakarta.annotation.Nullable;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public interface EmployeeService {

    EmployeeDTO createEmployee(EmployeeDTO employeeDTO, @Nullable Boolean initial) throws AccessDeniedException;

    PublicEmployeeDTO getEmployeeByAccountCodeAndOrgCode(String accountCode, String orgCode);

    List<PublicEmployeeDTO> searchEmployees(String firstName, String lastName);

    EmployeeDTO getEmployeeDetails(PublicEmployeeDTO employeeDTO, PublicEmploymentDTO client);

    EmployeeDTO editEmployee(EmployeeDTO employeeDTO) throws AccessDeniedException;

    boolean deleteEmployee(EmployeeDTO employeeDTO) throws Exception;
}
