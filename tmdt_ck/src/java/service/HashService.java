package service;

import org.apache.commons.codec.digest.DigestUtils;

public class HashService {
    public String hashMd5(String password) {
        return DigestUtils.md5Hex(password);
    }
}
