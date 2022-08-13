package a609.backend.controller;

import a609.backend.db.entity.User;
import a609.backend.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/file")
public class FileController {

    @Autowired
    FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> fileUpload(@RequestHeader Map<String,Object> token, @RequestParam("file") MultipartFile file) throws IOException {

        Map<String, String> resultMap = new HashMap<>();
        HttpStatus status = null;
        // 이미지 파일만 업로드 가능
        try {
            if (file.getContentType().startsWith("image")) {
                fileService.uploadFile(file, (String) token.get("authorization"));
//            fileService.fileUpload(file);
                User image = fileService.findImageById((String) token.get("authorization"));
                resultMap.put("image_path", image.getImagePath());
            } else {
                resultMap.put("message", "이미지 파일만 업로드 가능합니다.");
            }
            return new ResponseEntity<Map<String, String>>(resultMap, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("message", "파일 이미지 용량 초과");
            return new ResponseEntity<Map<String, String>>(resultMap, HttpStatus.BAD_REQUEST);
        }



    }

    @GetMapping("/view")
    public ResponseEntity<Map<String, String>> fileView(@RequestHeader Map<String,Object> token) {
        Map<String, String> resultMap = new HashMap<>();
        User image = fileService.findImageById((String) token.get("authorization"));
        if (image.getImagePath() ==null) {
            resultMap.put("message", "등록된 사진이 없습니다.");
        } else {
            resultMap.put("image_path",image.getImagePath());
        }
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> fileDelete(@RequestHeader Map<String,Object> token) {
        Map<String, String> resultMap = new HashMap<>();
        int check= fileService.deleteById((String) token.get("authorization"));
        if(check==1){
            resultMap.put("message", "Success");
        }else {
            resultMap.put("message", "존재하지 않는 이미지입니다.");
        }
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

}
