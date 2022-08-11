package a609.backend.util;

import org.mindrot.jbcrypt.BCrypt;

public class EncryptUtil {
    public static String encrypt(String pw){
        return BCrypt.hashpw(pw, BCrypt.gensalt());
    }

    public static boolean isMatch(String plainPassword, String hashedPassword){
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}
