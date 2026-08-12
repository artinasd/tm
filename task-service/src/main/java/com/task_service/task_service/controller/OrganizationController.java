package com.task_service.task_service.controller;

import com.task_service.task_service.dto.OrganizationDTO;
import com.task_service.task_service.dto.PublicEmployeeDTO;
import com.task_service.task_service.dto.PublicOrganizationDTO;
import com.task_service.task_service.dto.PublicUnitDTO;
import com.task_service.task_service.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@RestController
@RequestMapping("api/orgs")
public class OrganizationController {

    @Autowired
    private OrganizationService service;

    @PostMapping("add")
    public ResponseEntity<OrganizationDTO> createOrganization(@RequestBody OrganizationDTO orgDTO) throws NoSuchAlgorithmException, AccessDeniedException {
        return new ResponseEntity<>(service.createOrganization(orgDTO), HttpStatus.CREATED);
    }

    @GetMapping("{orgCode}")
    public ResponseEntity<PublicOrganizationDTO> getOrganizationByOrgCode(@PathVariable String orgCode) {
        return new ResponseEntity<>(service.getOrganizationByOrgCode(orgCode), HttpStatus.OK);
    }

    @GetMapping("getRole/{orgCode}")
    public ResponseEntity<String> getRoleInOrganization(@PathVariable String orgCode){
        return new ResponseEntity<>(service.getRoleInOrganization(orgCode), HttpStatus.OK);
    }

    @GetMapping("{orgCode}/employees")
    public ResponseEntity<List<PublicEmployeeDTO>> getOrganizationEmployees(@PathVariable String orgCode){
        return new ResponseEntity<>(service.getOrganizationEmployees(orgCode), HttpStatus.OK);
    }

    @GetMapping("{orgCode}/details")
    public ResponseEntity<OrganizationDTO> getOrganizationDetails(@PathVariable String orgCode) throws AccessDeniedException {
        return new ResponseEntity<>(service.getOrganizationDetails(orgCode), HttpStatus.OK);
    }

    @GetMapping("{orgCode}/units")
    public ResponseEntity<List<PublicUnitDTO>> getOrganizationUnits(@PathVariable String orgCode) throws AccessDeniedException {
        return new ResponseEntity<>(service.getUnits(orgCode), HttpStatus.OK);
    }

    @PatchMapping("{orgCode}/changeBoss")
    public ResponseEntity<OrganizationDTO> changeBoss(@PathVariable String orgCode, String newBossCode) throws AccessDeniedException {
        return new ResponseEntity<>(service.changeBoss(orgCode, newBossCode), HttpStatus.OK);
    }

    @DeleteMapping("delete/{orgCode}")
    public ResponseEntity<String> deleteOrganization(@PathVariable String orgCode) throws AccessDeniedException {
        boolean succeed = service.deleteOrganization(orgCode);
        if (succeed)
            return new ResponseEntity<>("Organization deleted successfully!", HttpStatus.OK);

        return new ResponseEntity<>("Organization can not be deleted!!!", HttpStatus.OK);
    }

}
