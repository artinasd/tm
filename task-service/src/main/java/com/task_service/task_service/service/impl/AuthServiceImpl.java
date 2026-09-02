package com.task_service.task_service.service.impl;

import com.task_service.task_service.dto.AccountDTO;
import com.task_service.task_service.dto.AuthResponse;
import com.task_service.task_service.entity.Account;
import com.task_service.task_service.repository.AccountRepository;
import com.task_service.task_service.security.AccountDetail;
import com.task_service.task_service.security.AccountDetailsService;
import com.task_service.task_service.security.JwtService;
import com.task_service.task_service.security.RefreshJwtService;
import com.task_service.task_service.service.AccountService;
import com.task_service.task_service.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
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
        String accountID = accountDTO.getAccountID();
        if (accountID == null || accountID.isBlank() || accountDTO.getHashedPassword() == null) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        logger.info("Login requested for account ID: {}", accountID);

        Account account = accountRepository.findByAccountID(accountID.trim());
        if (account == null) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        AccountDetail accountDetail = new AccountDetail(account.getAccountCode(), account.getHashedPassword());
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                accountDetail,
                accountDTO.getHashedPassword()
        );

        Authentication authenticated = authenticationManager.authenticate(authentication);
        return createAuthResponse(authenticated);
    }

    @Override
    public AuthResponse register(AccountDTO accountDTO) throws NoSuchAlgorithmException {
        String rawPassword = accountDTO.getHashedPassword();
        if (rawPassword == null || rawPassword.isBlank()) {
            throw new BadCredentialsException("Password is required.");
        }

        logger.info("Register requested for account ID: {}", accountDTO.getAccountID());

        AccountDTO createdAccount = accountService.createAccount(accountDTO);
        Account account = accountRepository.findByAccountCode(createdAccount.getAccountCode());
        if (account == null) {
            throw new BadCredentialsException("Account registration could not be completed.");
        }

        AccountDetail accountDetail = new AccountDetail(account.getAccountCode(), account.getHashedPassword());
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                accountDetail,
                rawPassword
        );

        Authentication authenticated = authenticationManager.authenticate(authentication);
        return createAuthResponse(authenticated);
    }

    private AuthResponse createAuthResponse(Authentication authentication) {
        AuthResponse authResponse = new AuthResponse();
        authResponse.setAccessToken(jwtService.generateToken(authentication));
        authResponse.setRefreshToken(refreshJwtService.generateRefreshToken(authentication));
        return authResponse;
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()
                || !refreshJwtService.isTokenValid(refreshToken)
                || refreshJwtService.isTokenExpired(refreshToken)) {
            throw new BadCredentialsException("Invalid or expired refresh token.");
        }

        String accountCode = refreshJwtService.extractAccountID(refreshToken);
        UserDetails userDetails = accountDetailsService.loadUserByUsername(accountCode);
        AccountDetail accountDetail = new AccountDetail(userDetails.getUsername(), userDetails.getPassword());
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                accountDetail,
                null,
                userDetails.getAuthorities()
        );

        return createAuthResponse(authentication);
    }
}
