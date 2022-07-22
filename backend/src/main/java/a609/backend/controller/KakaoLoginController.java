package a609.backend.controller;

import a609.backend.service.KakaoLoginService;
import a609.backend.util.KaKaoUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;



@Slf4j
@RestController
@RequestMapping("/api/oauth/kakao")
public class KakaoLoginController {

    @Autowired
    KaKaoUtil kaKaoUtil;

    @Autowired
    KakaoLoginService kakaoLoginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam("code") String code) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        log.info("log info start");
        log.debug("log debug start");


        String loginResult = kakaoLoginService.login(code);
        if(loginResult.equals("fail")) {
            status = HttpStatus.NOT_FOUND;
            resultMap.put("message", "존재하지 않는 계정입니다.");
        }else {
            status = HttpStatus.OK;
            resultMap.put("사용자 정보", loginResult);//차후수정
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
        //필요하면 claim에 담아서 보내줘야함
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout() {
        kakaoLoginService.logout();
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @DeleteMapping("/delete/{rt}")
    public ResponseEntity<?> deletUser(@PathVariable String rt) {
//        String loginResult = kakaoLoginService.deleteUser();
       String newToken=kaKaoUtil.updateAccessToken(rt);
        return new ResponseEntity<String>(newToken, HttpStatus.OK);
    }

}
