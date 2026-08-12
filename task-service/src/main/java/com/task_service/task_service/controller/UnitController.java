package com.task_service.task_service.controller;

import com.task_service.task_service.dto.*;
import com.task_service.task_service.service.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.AccessDeniedException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@RestController
@RequestMapping("api/units")
public class UnitController {

    @Autowired
    UnitService service;

    @PostMapping("add")
    public ResponseEntity<UnitDTO> createUnit(@RequestBody UnitDTO unitDTO) throws NoSuchAlgorithmException, MalformedURLException {
        return new ResponseEntity<>(service.createUnit(unitDTO), HttpStatus.CREATED);
    }

    @PostMapping("{unitCode}/addEmployee")
    public ResponseEntity<List<PublicEmploymentDTO>> addEmployee(@PathVariable String unitCode,
                                                                 @RequestBody List<PublicEmployeeDTO> employees) throws AccessDeniedException {
        return new ResponseEntity<>(service.addEmployee(unitCode,employees), HttpStatus.OK);
    }

    @GetMapping("{unitCode}")
    public ResponseEntity<PublicUnitDTO> getUnitByUnitCode(@PathVariable String unitCode){
        return new ResponseEntity<>(service.getUnitByUnitCode(unitCode), HttpStatus.OK);
    }

    @GetMapping("search")
    public ResponseEntity<List<PublicUnitDTO>> searchUnit(@RequestParam String unitName,
                                                          @RequestParam String unitCode,
                                                          @RequestParam String orgName){
        return new ResponseEntity<>(service.searchUnit(unitName, unitCode, orgName), HttpStatus.OK);
    }

    @GetMapping("getDetails/{unitCode}")
    public ResponseEntity<UnitDTO> getUnitDetails(@PathVariable String unitCode) throws AccessDeniedException {
        return new ResponseEntity<>(service.getUnitDetails(unitCode), HttpStatus.OK);
    }

    @PatchMapping("edit/{unitCode}")
    public ResponseEntity<UnitDTO> editUnit(@PathVariable String unitCode,
                                            @RequestBody UnitDTO unitDTO){
        return new ResponseEntity<>(service.editUnit(unitCode, unitDTO), HttpStatus.OK);
    }

    @PatchMapping("{unitCode}/remove/{accountCode}")
    public ResponseEntity<String> removeEmployee(@PathVariable String accountCode,
                                                 @PathVariable String unitCode) throws AccessDeniedException {
        boolean removed = service.removeEmployee(accountCode, unitCode);

        if (removed)
            return new ResponseEntity<>("Employee removed successfully!", HttpStatus.OK);
        return new ResponseEntity<>("Employee can not be removed!", HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("delete/{unitCode}")
    public ResponseEntity<String> deleteUnit(@PathVariable String unitCode){
        service.deleteUnit(unitCode);
        return new ResponseEntity<>("Unit deleted successfully!", HttpStatus.OK);
    }
}















