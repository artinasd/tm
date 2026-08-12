package com.task_service.task_service.service;

import com.task_service.task_service.dto.OrganizationDTO;
import com.task_service.task_service.dto.PublicEmployeeDTO;
import com.task_service.task_service.dto.PublicOrganizationDTO;
import com.task_service.task_service.dto.PublicUnitDTO;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public interface OrganizationService {

    OrganizationDTO createOrganization(OrganizationDTO orgDTO) throws AccessDeniedException;

    List<PublicEmployeeDTO> getOrganizationEmployees(String orgCode);

    PublicOrganizationDTO getOrganizationByOrgCode(String orgCode);

    OrganizationDTO getOrganizationDetails(String orgCode) throws AccessDeniedException;

    boolean deleteOrganization(String orgCode) throws AccessDeniedException;

    OrganizationDTO changeBoss(String orgCode, String newBossCode) throws AccessDeniedException;

    String getRoleInOrganization(String orgCode);

    List<PublicUnitDTO> getUnits(String orgCode) throws AccessDeniedException;
}
