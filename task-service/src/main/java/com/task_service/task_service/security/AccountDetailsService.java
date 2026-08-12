package com.task_service.task_service.security;

import com.task_service.task_service.entity.Account;
import com.task_service.task_service.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AccountDetailsService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String accountCode) throws UsernameNotFoundException {
        Account account = accountRepository.findByAccountCode(accountCode);

        if (account == null)
            throw new UsernameNotFoundException("User not found with ID : " + accountCode);

        return new AccountDetail(account.getAccountCode(), account.getHashedPassword());
    }
}
