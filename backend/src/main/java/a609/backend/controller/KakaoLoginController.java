package a609.backend.controller;

import a609.backend.service.KakaoLoginService;
import a609.backend.util.KaKaoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth/kakao")
public class KakaoLoginController {

    @Autowired
    KaKaoUtil kaKaoUtil;

    @Autowired
    KakaoLoginService kakaoLoginService;

    @RequestMapping("/login")
    public ResponseEntity<?> login(@RequestParam("code") String code) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        String loginResult = kakaoLoginService.login(code);
        if(loginResult.equals("fail")) {
            status = HttpStatus.NOT_FOUND;
            resultMap.put("message", "존재하지 않는 계정입니다.");
        }else {
            status = HttpStatus.OK;
            resultMap.put("token", loginResult);
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @RequestMapping(value="/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        kaKaoUtil.kakaoLogout((String)session.getAttribute("accessToken"));
        session.removeAttribute("accessToken");
        session.removeAttribute("userId");
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }
}
