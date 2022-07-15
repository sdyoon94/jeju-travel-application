package a609.backend.controller;

import a609.backend.db.entity.User;
import a609.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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


    @PostMapping("/users")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user){
        HashMap<String, String> map = new HashMap<>();
        try{
            userService.registUser(user);
            map.put("message", "Success");
            return new ResponseEntity<>(map, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/users/confirm/{authKey}")
    public void confirmUser(@PathVariable String authKey){
        System.out.println("HI");
        userService.confirmUser(authKey);
        //링크 누르면 blank, 새 탭으로 열어야 반응함 이유 파악 필요
        //차후 로그인 창으로 리다이렉트한다(response.redirect(url))
        return;
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Map<String,String>> countById(@PathVariable String userId) {
        int count = userService.idCheck(userId);
        if (count == 1) {
            HashMap<String, String> map = new HashMap<>();
            map.put("messsage", "이미 존재하는 사용자 ID 입니다.");
            return new ResponseEntity<>(map, HttpStatus.CONFLICT);
        }
        return null;
    }
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String userId){
        HashMap<String, String> map = new HashMap<>();
        userService.deleteUser(userId);
        map.put("message", "Success");
        return new ResponseEntity<>(map, HttpStatus.ACCEPTED);
    }

    @GetMapping("/users/findpwd/{userId}")
    public ResponseEntity<Map<String, String>> findPassword(@PathVariable String userId){
        HashMap<String, String> map = new HashMap<>();

        if(userService.idCheck(userId)==0){
            map.put("message", "가입되지 않은 이메일입니다.");
        }else{
            userService.findPassword(userId);
            map.put("message", "임시 비밀번호를 발송하였습니다.");
        }
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

}
