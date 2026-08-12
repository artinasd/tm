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
        AuthResponse authResponse = new AuthResponse();

        logger.info("{}",accountDTO);

        Account account = accountRepository.findByAccountID(accountDTO.getAccountID());

        AccountDetail accountDetail = new AccountDetail(account.getAccountCode(), accountDTO.getHashedPassword());

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                accountDetail,
                accountDTO.getHashedPassword()
        );

        authenticationManager.authenticate(authentication);

        authResponse.setAccessToken(jwtService.generateToken(authentication));
        authResponse.setRefreshToken(refreshJwtService.generateRefreshToken(authentication));

        return authResponse;
    }

    @Override
    public AuthResponse register(AccountDTO accountDTO) throws NoSuchAlgorithmException {
        String rawPassword = accountDTO.getHashedPassword();

        logger.info("{}", accountDTO);

        accountDTO = accountService.createAccount(accountDTO);
        AccountDetail accountDetail = new AccountDetail(accountDTO.getAccountCode(), accountDTO.getHashedPassword());

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                accountDetail,
                rawPassword
        );

        authenticationManager.authenticate(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setAccessToken(jwtService.generateToken(authentication));
        authResponse.setRefreshToken(refreshJwtService.generateRefreshToken(authentication));

        return authResponse;
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        AuthResponse authResponse = new AuthResponse();
        if (refreshJwtService.isTokenValid(refreshToken) && !refreshJwtService.isTokenExpired(refreshToken)){
            String accountID = refreshJwtService.extractAccountID(refreshToken);
            UserDetails userDetails = accountDetailsService.loadUserByUsername(accountID);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null
            );

            authResponse.setRefreshToken(refreshJwtService.generateRefreshToken(authentication));
            authResponse.setAccessToken(jwtService.generateToken(authentication));
            return authResponse;
        }
        throw new RuntimeException(); // TODO: Handle with a appropriate exception
    }
}
