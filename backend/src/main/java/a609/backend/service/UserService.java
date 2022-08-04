package a609.backend.service;

import a609.backend.db.entity.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;

public interface UserService extends OAuth2UserService<OAuth2UserRequest, OAuth2User> {
//    User registerUser(User user);
    User searchByKakaoId(String kakaoId);//회원조회
//    User updateUser(String kakaoId, User user);//회원 정보 수정
    String updateUser(User user,String token);
//    int idCheck(String kakaoId);
    Claims verifyToken(String token);

    Map<String, Object> login(String code);

    void logout(String kakaoId);

    void deleteUser(String kakaoId);

}
