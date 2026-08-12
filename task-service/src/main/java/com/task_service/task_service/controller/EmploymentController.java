package com.task_service.task_service.controller;

import com.task_service.task_service.dto.EmploymentDTO;
import com.task_service.task_service.dto.PublicEmploymentDTO;
import com.task_service.task_service.exception.EntityNotFound;
import com.task_service.task_service.service.EmploymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("api/units/{unitCode}/employments")
public class EmploymentController {

    @Autowired
    private EmploymentService service;

    @PostMapping("add")
    public ResponseEntity<EmploymentDTO> createEmployment(@RequestBody EmploymentDTO employmentDTO) throws AccessDeniedException {
        return new ResponseEntity<>(service.createEmployment(employmentDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PublicEmploymentDTO>> getEmploymentByUnitCode(@PathVariable String unitCode){
        return new ResponseEntity<>(service.getEmploymentsByUnitCode(unitCode), HttpStatus.OK);
    }

    @GetMapping("search")
    public ResponseEntity<List<PublicEmploymentDTO>> searchEmployment(@PathVariable String unitCode,
                                                                      @RequestParam String accountId,
                                                                      @RequestParam String accountName){
        return new ResponseEntity<>(service.searchEmployments(unitCode, accountId, accountName), HttpStatus.OK);
    }

    @PatchMapping("promote")
    public ResponseEntity<String> promoteEmployee(@PathVariable String unitCode,
                                                  @RequestParam String accountCode) throws AccessDeniedException {
        Boolean promote = service.promoteEmployment(unitCode, accountCode);

        if (promote)
            return new ResponseEntity<>("Employee promoted to Admin!", HttpStatus.OK);
        else
            return new ResponseEntity<>("Employee can not be promoted!", HttpStatus.BAD_REQUEST); // TODO : Handle it with a exception handler
    }

    @DeleteMapping("leave/{accountCode}")
    public ResponseEntity<String> leaveUnit(@PathVariable String unitCode,
                                            @PathVariable String accountCode){
        Boolean left = service.leaveUnit(unitCode, accountCode);

        if (left)
            return new ResponseEntity<>("Employee left the unit!", HttpStatus.OK);
        else
            throw new EntityNotFound("Employment", "accountCode", accountCode);
    }
}














