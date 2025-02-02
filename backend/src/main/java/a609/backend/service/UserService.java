package a609.backend.service;

import a609.backend.db.entity.User;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;

public interface UserService extends OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    User searchByKakaoId(Long kakaoId);//회원조회
    String updateUser(User user,String token);

    Map<String, Object> login(String code);

    void logout(String token);

    void deleteUser(String token);

    Map<String, Object> refreshToken(String refreshToken);
}
