package com.task_service.task_service.controller;

import com.task_service.task_service.dto.EmployeeDTO;
import com.task_service.task_service.dto.PublicEmployeeDTO;
import com.task_service.task_service.dto.PublicEmploymentDTO;
import com.task_service.task_service.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    @PostMapping("add")
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody EmployeeDTO employmentDTO) throws AccessDeniedException {
        return new ResponseEntity<>(service.createEmployee(employmentDTO, null), HttpStatus.CREATED);
    }

    @GetMapping("view")
    public ResponseEntity<PublicEmployeeDTO> viewEmployee(@RequestParam String accountCode,
                                                          @RequestParam String orgCode){
        return new ResponseEntity<>(service.getEmployeeByAccountCodeAndOrgCode(accountCode, orgCode), HttpStatus.OK);
    }

    @GetMapping("getDetails")
    public ResponseEntity<EmployeeDTO> getEmployeeDetails(@RequestParam PublicEmployeeDTO publicEmployee,
                                                          @RequestParam PublicEmploymentDTO client){
        return new ResponseEntity<>(service.getEmployeeDetails(publicEmployee, client), HttpStatus.OK);
    }

    @GetMapping("search")
    public ResponseEntity<List<PublicEmployeeDTO>> searchEmployee(@RequestParam String firstName,
                                                                  @RequestParam String lastName){
        return new ResponseEntity<>(service.searchEmployees(firstName, lastName), HttpStatus.OK);
    }

    @PatchMapping("edit")
    public ResponseEntity<EmployeeDTO> editEmployee(@RequestBody EmployeeDTO employeeDTO) throws AccessDeniedException {
        return new ResponseEntity<>(service.editEmployee(employeeDTO), HttpStatus.OK);
    }

    @DeleteMapping("delete")
    public ResponseEntity<String> deleteEmployee(@RequestParam EmployeeDTO employeeDTO) throws Exception {
        boolean succeeded = service.deleteEmployee(employeeDTO);

        if (succeeded)
            return new ResponseEntity<>("Employee deleted successfully!", HttpStatus.OK);

        return new ResponseEntity<>("Employee can not be deleted!", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
