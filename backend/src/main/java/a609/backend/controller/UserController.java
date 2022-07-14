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
            //userService.save(user)
            map.put("message", "Success");
            return new ResponseEntity<>(map, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Map<String,String>> countById(@RequestParam String userId) {
        int count = userService.countById();
        if (count == 1) {
            HashMap<String, String> map = new HashMap<>();
            map.put("messsage", "이미 존재하는 사용자 ID 입니다.");
            return new ResponseEntity<>(map, HttpStatus.CONFLICT);
        }
        return null;
    }
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestParam String userId){
        HashMap<String, String> map = new HashMap<>();
        userService.deleteUser(userId);
        map.put("message", "Success");
        return new ResponseEntity<>(map, HttpStatus.ACCEPTED);
    }
//    @PatchMapping("/users/{userId}")
//    public ResponseEntity<Map<String, String>>
}
