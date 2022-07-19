package a609.backend.controller;

import a609.backend.db.entity.User;
import a609.backend.service.UserService;
import a609.backend.util.EncryptUtil;
import a609.backend.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;


    @PostMapping("/users")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        HashMap<String, String> map = new HashMap<>();
        try {
            userService.registerUser(user);
            map.put("message", "Success");
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/users/confirm/{authKey}")
    public void confirmUser(@PathVariable String authKey) {
        System.out.println("HI");
        userService.confirmUser(authKey);
        //링크 누르면 blank, 새 탭으로 열어야 반응함 이유 파악 필요
        //차후 로그인 창으로 리다이렉트한다(response.redirect(url))
        return;
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> countById(@PathVariable String userId) {
        int count = userService.idCheck(userId);
        if (count == 1) {
            HashMap<String, String> map = new HashMap<>();
            map.put("messsage", "이미 존재하는 사용자 ID 입니다.");
            return new ResponseEntity<>(map, HttpStatus.CONFLICT);
        }
        return null;
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String userId) {
        HashMap<String, String> map = new HashMap<>();
        userService.deleteUser(userId);
        map.put("message", "Success");
        return new ResponseEntity<>(map, HttpStatus.ACCEPTED);
    }

    @GetMapping("/users/findpwd/{userId}")
    public ResponseEntity<Map<String, String>> findPassword(@PathVariable String userId) {
        HashMap<String, String> map = new HashMap<>();

        if (userService.idCheck(userId) == 0) {
            map.put("message", "가입되지 않은 이메일입니다.");
        } else {
            userService.findPassword(userId);
            map.put("message", "임시 비밀번호를 발송하였습니다.");
        }
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    @PatchMapping("/users/{userId}")
    public ResponseEntity updateUser(@PathVariable String userId, @RequestBody User user) {
        userService.updateUser(userId, user);
        HashMap<String, String> map = new HashMap<>();
        map.put("message", "Success");
        return new ResponseEntity(map, HttpStatus.NO_CONTENT);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        Map<String, String> resultMap = new HashMap<>();
        HttpStatus status = null;
        String loginResult = userService.login(user);
        if (loginResult.equals("404")) {
            status = HttpStatus.NOT_FOUND;
            resultMap.put("message", "존재하지 않는 계정입니다.");
        } else if (loginResult.equals("401")) {
            status = HttpStatus.UNAUTHORIZED;
            resultMap.put("message", "잘못된 비밀번호입니다.");
        } else {
            status = HttpStatus.OK;
            resultMap.put("token", loginResult);
        }

        return new ResponseEntity<Map<String, String>>(resultMap, status);
    }

    @GetMapping("/users/me")
    public ResponseEntity<Map<String, Object>> myProfile(@RequestBody Map<String, String> tokenMap) {
        Map<String, Object> resultMap = new HashMap<>();
        Claims claims = userService.verifyToken(tokenMap.get("token"));
        resultMap.put("id", claims.get("id"));
        resultMap.put("authority", claims.get("authority"));
        resultMap.put("nickname", claims.get("nickname"));
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/auth/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestBody Map<String, String> tokenMap){
        Map<String, Object> resultMap = new HashMap<>();
        Claims claims = userService.verifyToken(tokenMap.get("token"));
        HttpStatus status = null;
        if (claims == null) {
            resultMap.put("message", "토큰 에러");
            status = HttpStatus.BAD_REQUEST;
        } else {
            resultMap = claims;
            status = HttpStatus.OK;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @PostMapping("/users/checkpwd")
    public ResponseEntity pwCheck(@RequestHeader HttpHeaders headers, @RequestBody Map<String, Object> params){
        String token = headers.get("token").get(0);
        String password = (String) params.get("password");
        String newPassword = (String) params.get("newPassword");
        boolean result = userService.pwCheck(token, password, newPassword);
        if(result){

            return ResponseEntity.ok("비밀번호 변경 성공");
            //변경 후 리다이렉트? 아니면 프런트단에서?
        }else return ResponseEntity.notFound().build();
    }
}
