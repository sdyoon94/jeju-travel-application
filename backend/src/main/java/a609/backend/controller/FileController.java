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

@RestController
@RequestMapping("/api/file")
public class FileController {

    @Autowired
    FileService fileService;

    @PostMapping("/upload/{id}")
    public ResponseEntity<Map<String, String>> fileUpload(@PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {

        Map<String, String> resultMap = new HashMap<>();
        HttpStatus status = null;
        // 이미지 파일만 업로드 가능
        if (file.getContentType().startsWith("image") ) {
            fileService.uploadFile(file,id);
            resultMap.put("message","Success");
        }else {
            resultMap.put("message","이미지 파일만 업로드 가능합니다.");
        }

        return new ResponseEntity<Map<String, String>>(resultMap, HttpStatus.OK);

    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Map<String, String>> fileView(@PathVariable String id) {
        Map<String, String> resultMap = new HashMap<>();
        User image = fileService.findImageById(id);
        if (image ==null) {
            resultMap.put("message", "등록된 사진이 없습니다.");
        } else {
            resultMap.put("filePath",image.getImagePath());
        }
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> fileDelete(@PathVariable String id) {
        Map<String, String> resultMap = new HashMap<>();

        int check= fileService.deleteById(id);
        if(check==1){
            resultMap.put("message", "Success");
        }else {
            resultMap.put("message", "존재하지 않는 이미지입니다.");
        }

        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

}
