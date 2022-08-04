package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import a609.backend.util.JwtUtil;
import a609.backend.util.KaKaoUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    KaKaoUtil KakaoUtil;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("유저리퀘스트엔 무엇이 들었을까? : {}", userRequest.getAccessToken().toString());
        log.info("어디셔널 : {}", userRequest.getAdditionalParameters().toString());
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        log.info("오오스2유저 어트리뷰트엔 무엇이 들었을까? : {}", attributes.toString());

        String kakaoId = String.valueOf(attributes.get("id"));

        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        String email = (String) kakaoAccount.get("email");

        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
        String nickname = (String) properties.get("nickname");
        String imagePath = (String) properties.get("profile_image");

        User user;
        if (userRepository.countByKakaoId(kakaoId)==0) {
            user = User.builder().kakaoId(kakaoId).nickname(nickname).imagePath(imagePath).build();
            userRepository.save(user);
        } else{
            user = userRepository.findOneByKakaoId(kakaoId);
        }

        return new DefaultOAuth2User(Collections.singleton(new SimpleGrantedAuthority("USER")), attributes, "id");
    }

//    @Override
//    public User registerUser(User user) {
////        String authKey = RandomStringUtils.randomAlphanumeric(10);
////        mailUtil.sendConfirmMail(user.getUsername(), authKey);
//
//        return userRepository.save(user);
//    }

    @Override
    public User searchByKakaoId(String id) {
        return userRepository.findOneByKakaoId(id);
    }

    @Transactional
    @Override
    public String updateUser(User user, String token) {
        log.info("----------------------------------------------------");
        log.info(token);
        log.info((String)jwtUtil.parseJwtToken(token).get("id"));
        User originUser = userRepository.findOneByKakaoId((String)jwtUtil.parseJwtToken(token).get("id"));

        log.info("----------------------------------------------------");
        log.info(originUser.getNickname());
        if (user.getNickname() != null) {
            originUser.setNickname(user.getNickname());
        }
        log.info("----------------------------------------------------");
        log.info(originUser.getNickname());
        return userRepository.save(originUser).getNickname();

    }


//    @Override
//    public User updateUser(String id, User user) {
//        User originUser = userRepository.findOneByKakaoId(id);
//        if (user.getNickname() != null) {
//            originUser.setNickname(user.getNickname());
//        }
//        return userRepository.save(originUser);
//
//    }
//
//    @Override
//    public int idCheck(String id) {
//        return userRepository.countByKakaoId(id);
//    }



    @Override
    public Claims verifyToken(String token) {
        return jwtUtil.parseJwtToken(token);
    }

    @Override
    public Map<String, Object> login(String code) {
        Map<String, Object> getToken = KakaoUtil.getAccessToken(code);
//        String id = KakaoUtil.getTokenInfo(String.valueOf(getToken.get("accessToken")));

        // 2번 인증코드로 토큰 전달
        HashMap<String, Object> userInfo = KakaoUtil.getUserInfo(String.valueOf(getToken.get("accessToken")));

        //3.등록된 id가 없다면 카카오 id로 DB에 회원가입 처리
        if(userRepository.countByKakaoId(String.valueOf(userInfo.get("id")))==0) {
            User user = new User();
            user.setKakaoId(String.valueOf(userInfo.get("id")));
            user.setNickname(String.valueOf(userInfo.get("nickname")));
            user.setRefreshToken(String.valueOf(getToken.get("refreshToken")));
            user.setImagePath(String.valueOf(userInfo.get("imagePath")));
            userRepository.save(user);
        }
        //4. response Header에 JWT토큰 추가

//          String token = jwtUtil.generateJwtToken();
        String token = String.valueOf(userInfo.get("nickname"));//차후 수정
        Map<String, Object> res = new HashMap<>();
        res.put("token",String.valueOf(userInfo.get("id")));
        return res;

    }

    @Override
    public void logout(String token) {
        User user = userRepository.findOneByKakaoId((String)jwtUtil.parseJwtToken(token).get("id"));
//        String refreshdToken = user.getRefreshToken();
//        String accessToken = KakaoUtil.updateAccessToken(refreshdToken);
        KakaoUtil.kakaoLogout(token.split(" ")[1]);
    }

    @Override
    public void deleteUser(String token) {
//        String refreshToken = this.searchByKakaoId(kakaoId).getRefreshToken();
//        String accessToken = KakaoUtil.updateAccessToken(refreshToken);
        KakaoUtil.unlink(token.split(" ")[1]);

        userRepository.deleteUserByKakaoId((String)jwtUtil.parseJwtToken(token).get("id"));
    }


}
