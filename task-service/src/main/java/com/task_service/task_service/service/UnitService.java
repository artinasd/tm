package com.task_service.task_service.service;

import com.task_service.task_service.dto.*;
import com.task_service.task_service.entity.Link;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.nio.file.AccessDeniedException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Service
public interface UnitService {
    UnitDTO createUnit(UnitDTO unitDTO) throws NoSuchAlgorithmException, MalformedURLException;

    PublicUnitDTO getUnitByUnitCode(String unitCode);

    List<PublicUnitDTO> searchUnit(String unitName,String unitCode, String orgName);

    UnitDTO getUnitDetails(String unitCode) throws AccessDeniedException;

    UnitDTO editUnit(String unitCode, UnitDTO unitDTO);

    boolean removeEmployee(String accountCode, String unitCode) throws AccessDeniedException;

    void deleteUnit(String unitCode);

    Link createLink(LinkDTO linkRequest) throws MalformedURLException, NoSuchAlgorithmException;

    List<PublicEmploymentDTO> addEmployee(String unitCode, List<PublicEmployeeDTO> employees) throws AccessDeniedException;
}
