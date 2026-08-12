package com.task_service.task_service.service;

import com.task_service.task_service.dto.EmploymentDTO;
import com.task_service.task_service.dto.PublicEmploymentDTO;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public interface EmploymentService {
    EmploymentDTO createEmployment(EmploymentDTO employmentDTO) throws AccessDeniedException;

    List<PublicEmploymentDTO> getEmploymentsByUnitCode(String UnitCode);

    List<PublicEmploymentDTO> searchEmployments(String UnitCode, String accountId, String accountName);

    Boolean promoteEmployment(String UnitCode, String accountCode) throws AccessDeniedException;

    Boolean leaveUnit(String UnitCode, String accountCode);
}
