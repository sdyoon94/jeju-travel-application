package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.util.JwtUtil;
import a609.backend.util.KaKaoUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class KakaoLoginServiceImpl implements KakaoLoginService {

    @Autowired
    KaKaoUtil kaKaoUtil;

    @Autowired
    UserService userService;

    @Override
    public String login(String code) {
        // 1번 인증코드 요청 전달
        Map<String, Object> getToken = kaKaoUtil.getAccessToken(code);

        // 2번 인증코드로 토큰 전달
        HashMap<String, Object> userInfo = kaKaoUtil.getUserInfo(getToken.get("accessToken").toString());

        //3.등록된 id가 없다면 카카오 id로 DB에 회원가입 처리
        if(userService.searchByUserEmail(userInfo.get("email").toString())==null) {
            User user = new User();
            user.setUserEmail(userInfo.get("email").toString());
            user.setNickname(userInfo.get("nickname").toString());
            user.setRefreshToken(getToken.get("refreshToken").toString());
            user.setImagePath(userInfo.get("imagePath").toString());

            userService.registerUser(user);
        }
        //4. response Header에 JWT토큰 추가

        log.info(userInfo.toString());

        if(userInfo.get("email") != null) {

//          String token = jwtUtil.generateJwtToken();
            String token = userInfo.get("nickname").toString();//차후 수정
            return token;
        }else {
            return "fail";
        }
    }

    @Override
    public String logout(String userEmail) {
        User user =  userService.searchByUserEmail(userEmail);
        String refreshToken =user.getRefreshToken();
        String accessToken = kaKaoUtil.updateAccessToken(refreshToken);
        kaKaoUtil.kakaoLogout(accessToken);

        return null;
    }


    @Override
    public void deleteUser(String userEmail) {
        String refreshToken = userService.searchByUserEmail(userEmail).getRefreshToken();
        String accessToken = kaKaoUtil.updateAccessToken(refreshToken);
        kaKaoUtil.unlink(accessToken);

        userService.deleteUser(userEmail);

    }
}
