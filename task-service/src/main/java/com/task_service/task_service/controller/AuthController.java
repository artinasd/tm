package com.task_service.task_service.controller;

import com.task_service.task_service.dto.AccountDTO;
import com.task_service.task_service.dto.AuthResponse;
import com.task_service.task_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("login")
    public AuthResponse login(@RequestBody AccountDTO accountDTO){
        return authService.login(accountDTO);
    }

    @PostMapping("register")
    public AuthResponse register(@RequestBody AccountDTO accountDTO) throws NoSuchAlgorithmException {
        return authService.register(accountDTO);
    }

    @PostMapping("refresh")
    public AuthResponse refresh(@RequestBody String refreshToken){
        return authService.refresh(refreshToken);
    }

    @GetMapping("/test")
    public String testMethod(){
        return "hello!";
    }
}
