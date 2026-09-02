package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.AccountDTO;
import com.task_service.task_service.dto.AuthResponse;
import com.task_service.task_service.entity.Account;
import com.task_service.task_service.repository.AccountRepository;
import com.task_service.task_service.security.AccountDetailsService;
import com.task_service.task_service.security.JwtService;
import com.task_service.task_service.security.RefreshJwtService;
import com.task_service.task_service.service.AccountService;
import com.task_service.task_service.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private RefreshJwtService refreshJwtService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AccountDetailsService accountDetailsService;

    private final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Override
    public AuthResponse login(AccountDTO accountDTO) {
        logger.info("Login requested for account ID: {}", accountDTO.getAccountID());

        Account account = accountRepository.findByAccountID(accountDTO.getAccountID());
        if (account == null) {
            throw new org.springframework.security.core.userdetails.UsernameNotFoundException("Invalid username or password.");
        }

        Authentication authentication = authenticate(account.getAccountCode(), accountDTO.getHashedPassword());
        return createAuthResponse(authentication);
    }

    @Override
    public AuthResponse register(AccountDTO accountDTO) throws NoSuchAlgorithmException {
        String rawPassword = accountDTO.getHashedPassword();

        logger.info("Register requested for account ID: {}", accountDTO.getAccountID());

        AccountDTO createdAccount = accountService.createAccount(accountDTO);
        Authentication authentication = authenticate(createdAccount.getAccountCode(), rawPassword);
        return createAuthResponse(authentication);
    }

    private Authentication authenticate(String accountCode, String rawPassword) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(accountCode, rawPassword);
        return authenticationManager.authenticate(authentication);
    }

    private AuthResponse createAuthResponse(Authentication authentication) {
        AuthResponse authResponse = new AuthResponse();
        authResponse.setAccessToken(jwtService.generateToken(authentication));
        authResponse.setRefreshToken(refreshJwtService.generateRefreshToken(authentication));
        return authResponse;
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        AuthResponse authResponse = new AuthResponse();
        if (refreshJwtService.isTokenValid(refreshToken) && !refreshJwtService.isTokenExpired(refreshToken)) {
            String accountCode = refreshJwtService.extractAccountID(refreshToken);
            var userDetails = accountDetailsService.loadUserByUsername(accountCode);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            authResponse.setRefreshToken(refreshJwtService.generateRefreshToken(authentication));
            authResponse.setAccessToken(jwtService.generateToken(authentication));
            return authResponse;
        }
        throw new org.springframework.security.authentication.BadCredentialsException("Invalid or expired refresh token.");
    }
}
