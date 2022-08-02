package a609.backend.service;

import a609.backend.db.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    void uploadFile(MultipartFile file, String id);
    User findImageById(String id);

    int deleteById(String id);
}