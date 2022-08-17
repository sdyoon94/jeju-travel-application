package a609.backend.service;

import a609.backend.db.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    void uploadFile(MultipartFile file, String token);
    User findImageById(String token);


}