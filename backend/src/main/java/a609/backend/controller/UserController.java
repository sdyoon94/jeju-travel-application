package a609.backend.controller;

import a609.backend.db.entity.User;
import a609.backend.service.UserService;
import a609.backend.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;

    @PatchMapping("/users")
    public ResponseEntity updateUser(@RequestBody User user, @RequestHeader Map<String,Object> token) {
        log.info("----------------------------------------------------");
        log.info(token.toString());
        log.info("----------------------------------------------------");
        log.info(user.getNickname());
        String saveNickname = userService.updateUser(user, (String) token.get("authorization"));
        HashMap<String, String> map = new HashMap<>();
        map.put("nickname", saveNickname);
        return new ResponseEntity(map, HttpStatus.OK);
    }




    @GetMapping("/users/me")
    public ResponseEntity<Map<String, Object>> myProfile(@RequestHeader Map<String, Object> header) {
        Map<String, Object> resultMap = new HashMap<>();
        Claims claims = jwtUtil.parseJwtToken((String)header.get("authorization"));
        resultMap.put("id", claims.get("id"));
        resultMap.put("authority", claims.get("authority"));
        resultMap.put("nickname", claims.get("nickname"));
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/auth/verify")
    public ResponseEntity<Void> verifyToken(@RequestHeader Map<String, Object> header) {
        String token = (String) header.get("authorization");
        log.info("토큰 : {}", token);
        return new ResponseEntity<Void>(jwtUtil.validateJwtToken(token));
    }

    @GetMapping("/auth/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader Map<String, Object> header) {
        String refreshToken = (String) header.get("refreshToken");

        Map<String, Object> resultMap = userService.refreshToken(refreshToken);
        if(resultMap != null){
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        }else{
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader Map<String,Object> token) {
        userService.logout((String) token.get("authorization"));
        return new ResponseEntity<String>("success", HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestHeader Map<String,Object> token) {

        userService.deleteUser((String) token.get("authorization"));

        return new ResponseEntity<String>("성공", HttpStatus.OK);
    }
}
