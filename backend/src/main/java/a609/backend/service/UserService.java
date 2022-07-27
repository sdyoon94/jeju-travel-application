package a609.backend.service;

import a609.backend.db.entity.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Map;

public interface UserService extends UserDetailsService {
//    User registerUser(User user);
    User searchByKakaoId(String kakaoId);//회원조회
    void updateUser(String kakaoId, User user);//회원 정보 수정
//    int idCheck(String kakaoId);
    Claims verifyToken(String token);

    Map<String, Object> login(String code);

    void logout(String kakaoId);

    void deleteUser(String kakaoId);

}
