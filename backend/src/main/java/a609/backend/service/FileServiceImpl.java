package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import a609.backend.util.JwtUtil;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;

@Slf4j
@Service
public class FileServiceImpl implements FileService{
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;



    @Override
    public void uploadFile(MultipartFile file,String token) {
        Long id =((Long) jwtUtil.parseJwtToken(token).get("id"));


        String uploadPath =File.separator+"home"+ File.separator+"ubuntu"+File.separator+"jeju";
        String dbPath = File.separator + "saimedia" + File.separator +"Album";

        try {
            // 실행되는 위치의 'files' 폴더에 파일이 저장됩니다.
//            String savePath = System.getProperty("user.dir") + "\\files";
            String savePath = uploadPath+File.separator+id+File.separator+id + "." + extractExt(file.getOriginalFilename());


            // 파일이 저장되는 폴더가 없으면 폴더를 생성합니다.
            File uploadPathFolder = new File(uploadPath, String.valueOf(id));
            if (!uploadPathFolder.exists()) {
                uploadPathFolder.mkdir();
            }
        //r경로
            User user = userService.searchByKakaoId(id);

            //이미 등록된 사진이 있으면 삭제
            if(userRepository.findOneByKakaoId(id).getDbImagePath()!=null){
               this.deleteById(token);
            }
            Path path = Paths.get(savePath);
            file.transferTo(path);


            user.setImagePath("https://i7a609.p.ssafy.io:8080"+savePath);
            //////여기가 이상한데???
            user.setDbImagePath(savePath);

            userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public User findImageById(String token) {
        Long id =((Long) jwtUtil.parseJwtToken(token).get("id"));

        return userRepository.findOneByKakaoId(id);
    }



    @Override
    public int deleteById(String token) {
        Long id =((Long) jwtUtil.parseJwtToken(token).get("id"));

        User targetUser = userRepository.findOneByKakaoId(id);
        if(targetUser.getDbImagePath()!=null){
            File file = new File(targetUser.getDbImagePath());
            file.delete();
            targetUser.setImagePath("");
            targetUser.setDbImagePath("");
            userRepository.save(targetUser);
            return 1;
        }else {
            return 0;
        }
    }

    private String uploadDir = System.getProperty("user.dir") + "\\files";


    // 확장자 추출
    private String extractExt(String originalFilename) {
        int pos = originalFilename.lastIndexOf(".");
        return originalFilename.substring(pos + 1);
    }
}