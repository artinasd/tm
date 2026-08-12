package com.task_service.task_service.utility.PasswordHasher;

import java.security.NoSuchAlgorithmException;

public interface Hash {
  String hash(String passwordToHash) throws NoSuchAlgorithmException;
}
