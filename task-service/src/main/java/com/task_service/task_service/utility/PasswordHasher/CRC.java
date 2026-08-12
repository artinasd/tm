package com.task_service.task_service.utility.PasswordHasher;

import java.security.NoSuchAlgorithmException;
import java.util.zip.CRC32;

public class CRC implements Hash {
    @Override
    public String hash(String passwordToHash) throws NoSuchAlgorithmException {
        CRC32 crc = new CRC32();
        crc.update(passwordToHash.getBytes());
        long crcValue = crc.getValue();
        return Long.toHexString(crcValue);
    }
}
