package a609.backend.service;

import a609.backend.db.entity.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
//    User registerUser(User user);
    User searchByUserEmail(String userEmail);//회원조회
    void updateUser(String userEmail, User user);//회원 정보 수정
//    int idCheck(String userEmail);
    Claims verifyToken(String token);

    String login(String code);

    void logout(String userEmail);

    void deleteUser(String userEmail);

}
