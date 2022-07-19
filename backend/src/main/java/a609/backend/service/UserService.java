package a609.backend.service;

import a609.backend.db.entity.User;
import io.jsonwebtoken.Claims;

public interface UserService {
    User registerUser(User user);
    User searchById(String id);//회원조회
    void deleteUser(String id);
    void updateUser(String id, User user);//회원 정보 수정
    int idCheck(String id);
    String login(User user);//로그인
    void findPassword(String id);
    void confirmUser(String key);
    Claims verifyToken(String token);

    boolean pwCheck(String token, String password);
}
