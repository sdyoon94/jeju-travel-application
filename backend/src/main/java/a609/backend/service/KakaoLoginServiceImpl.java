package a609.backend.service;

import a609.backend.util.JwtUtil;
import a609.backend.util.KaKaoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class KakaoLoginServiceImpl implements KakaoLoginService {

    @Autowired
    KaKaoUtil kaKaoUtil;

    @Autowired
    JwtUtil jwtUtil;

    @Override
    public String login(String code) {
        // 1번 인증코드 요청 전달
        String accessToken = kaKaoUtil.getAccessToken(code);

        // 2번 인증코드로 토큰 전달
        HashMap<String, Object> userInfo = kaKaoUtil.getUserInfo(accessToken);
        //3. 카카오 id로 회원가입 처리
        //4. 강제 로그인처리
        //5. response Header에 JWT토큰 추가

        System.out.println("login info : " + userInfo.toString());


        if(userInfo.get("email") != null) {

//            String token = jwtUtil.createToken((String) userInfo.get("email"),1, (String) userInfo.get("name"),true);
            String token = "token"; // 임시 더미
            return token;
        }else {
            return "fail";
        }
    }
}
