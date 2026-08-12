package com.task_service.task_service.security;

import com.task_service.task_service.utility.PasswordHasher.Hash;
import com.task_service.task_service.utility.PasswordHasher.SHA256;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.NoSuchAlgorithmException;

@Component
@RequiredArgsConstructor
public class HashPasswordEncoder implements PasswordEncoder {

    private final Hash hash = new SHA256();

    @Override
    public String encode(CharSequence rawPassword) {
        try {
            return hash.hash(rawPassword.toString());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        try {
            return hash.hash(rawPassword.toString()).equals(encodedPassword);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
