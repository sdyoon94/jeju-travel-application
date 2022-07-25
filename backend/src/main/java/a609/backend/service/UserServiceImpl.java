package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import a609.backend.util.JwtUtil;
import a609.backend.util.KaKaoUtil;
import a609.backend.util.MailUtil;
import io.jsonwebtoken.Claims;
import org.apache.commons.lang3.RandomStringUtils;
import a609.backend.util.EncryptUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService{
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
        HashMap<String, Object> userInfo = KakaoUtil.getUserInfo(getToken.get("accessToken").toString());

        //3.등록된 id가 없다면 카카오 id로 DB에 회원가입 처리
        if(userRepository.countByUserEmail(userInfo.get("email").toString())==0) {
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
