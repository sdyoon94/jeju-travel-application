package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import a609.backend.util.JwtUtil;
import a609.backend.util.KaKaoUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class UserServiceImpl implements UserService, OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findOneByUserEmail(username);
        if (user == null) throw new UsernameNotFoundException("Not Found account.");
        return user;
    }

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    KaKaoUtil KakaoUtil;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        log.info(attributes.toString());

        // OAuth2 로그인 진행 시 키가 되는 필드 값(PK)
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // OAuth2UserService
        //OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());
        User user = userRepository.findOneByUserEmail(String.valueOf(attributes.get("Email")));

        return new DefaultOAuth2User(user.getAuthorities(), attributes, userNameAttributeName);
    }

//    @Override
//    public User registerUser(User user) {
////        String authKey = RandomStringUtils.randomAlphanumeric(10);
////        mailUtil.sendConfirmMail(user.getUsername(), authKey);
//
//        return userRepository.save(user);
//    }

    @Override
    public User searchByUserEmail(String id) {
        return userRepository.findOneByUserEmail(id);
    }


    @Override
    public void updateUser(String id, User user) {
        User originUser = userRepository.findOneByUserEmail(id);
        if (user.getNickname() != null) {
            originUser.setNickname(user.getNickname());
        }
        userRepository.save(originUser);

    }
//
//    @Override
//    public int idCheck(String id) {
//        return userRepository.countByUserEmail(id);
//    }



    @Override
    public Claims verifyToken(String token) {
        return jwtUtil.parseJwtToken(token);
    }

    @Override
    public String login(String code) {
        Map<String, Object> getToken = KakaoUtil.getAccessToken(code);

        // 2번 인증코드로 토큰 전달
        HashMap<String, Object> userInfo = KakaoUtil.getUserInfo(String.valueOf(getToken.get("accessToken")));

        //3.등록된 id가 없다면 카카오 id로 DB에 회원가입 처리
        if(userRepository.countByUserEmail(String.valueOf(userInfo.get("email")))==0) {
            User user = new User();
            user.setUserEmail(userInfo.get("email").toString());
            user.setNickname(userInfo.get("nickname").toString());
            user.setRefreshToken(getToken.get("refreshToken").toString());
            user.setImagePath(userInfo.get("imagePath").toString());
            userRepository.save(user);
        }
        //4. response Header에 JWT토큰 추가
        if(userInfo.get("email") != null) {

//          String token = jwtUtil.generateJwtToken();
            String token = userInfo.get("nickname").toString();//차후 수정
            return token;
        }else {
            return "fail";
        }
    }

    @Override
    public void logout(String userEmail) {
        User user = userRepository.findOneByUserEmail(userEmail);
        String refreshdToken = user.getRefreshToken();
        String accessToken = KakaoUtil.updateAccessToken(refreshdToken);
        KakaoUtil.kakaoLogout(accessToken);
    }

    @Override
    public void deleteUser(String userEmail) {
        String refreshToken = this.searchByUserEmail(userEmail).getRefreshToken();
        String accessToken = KakaoUtil.updateAccessToken(refreshToken);
        KakaoUtil.unlink(accessToken);

        userRepository.deleteUserByUserEmail(userEmail);
    }


}
