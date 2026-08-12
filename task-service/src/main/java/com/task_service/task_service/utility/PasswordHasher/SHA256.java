package com.task_service.task_service.utility.PasswordHasher;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SHA256 implements Hash {
    @Override
    public String hash(String passwordToHash) throws NoSuchAlgorithmException {
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        byte[] bytes = messageDigest.digest(passwordToHash.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        return byteToString(bytes);
    }

    private String byteToString(byte[] hashedPassword){
        StringBuilder stringBuilder = new StringBuilder(hashedPassword.length * 2);
        for (byte b : hashedPassword)
            stringBuilder.append(String.format("%02x", b & 0xff));

        return stringBuilder.toString();
    }
}
