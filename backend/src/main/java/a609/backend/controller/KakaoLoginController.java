package a609.backend.controller;

import a609.backend.service.UserService;
import a609.backend.util.KaKaoUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;



@Slf4j
@CrossOrigin("*")
@RestController
@RequestMapping("/api/oauth/kakao")
public class KakaoLoginController {

    @Autowired
    KaKaoUtil kaKaoUtil;

    @Autowired
    UserService userService;

    @GetMapping("/login")
    public ResponseEntity<?> login(@RequestParam(value = "code") String code) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;
        try {
            Map<String, Object> loginResult = userService.login(code);
            return new ResponseEntity<Map<String, Object>>(loginResult, HttpStatus.OK);

        }catch(Exception e){
            resultMap.put("error", e.getStackTrace());
            status=HttpStatus.FOUND;
            return new ResponseEntity<Map<String, Object>>(resultMap, status);
        }
    }

//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(@RequestHeader Map<String,Object> token) {
//        userService.logout((String) token.get("authorization"));
//        return new ResponseEntity<String>("success", HttpStatus.OK);
//    }
//
//    @DeleteMapping("/delete")
//    public ResponseEntity<?> deleteUser(@RequestHeader Map<String,Object> token) {
//
//         userService.deleteUser((String) token.get("authorization"));
//
//        return new ResponseEntity<String>("성공", HttpStatus.OK);
//    }

}
