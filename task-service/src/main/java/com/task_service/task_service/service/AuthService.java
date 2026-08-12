package com.task_service.task_service.service;

import com.task_service.task_service.dto.AccountDTO;
import com.task_service.task_service.dto.AuthResponse;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;

@Service
public interface AuthService {

    AuthResponse login(AccountDTO accountDTO);

    AuthResponse register(AccountDTO accountDTO) throws NoSuchAlgorithmException;

    AuthResponse refresh(String refreshToken);
}
