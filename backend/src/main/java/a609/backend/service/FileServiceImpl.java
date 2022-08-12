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


        String uploadPath =File.separator+"home"+ File.separator+"ubuntu"+File.separator+"jeju"+File.separator+id;
        String dbPath = File.separator + "saimedia" + File.separator +"Album";

        try {
            // 실행되는 위치의 'files' 폴더에 파일이 저장됩니다.
//            String savePath = System.getProperty("user.dir") + "\\files";
            String savePath = uploadPath+File.separator+id + "." + extractExt(file.getOriginalFilename());


            // 파일이 저장되는 폴더가 없으면 폴더를 생성합니다.
            File uploadPathFolder = new File(uploadPath+File.separator+id, String.valueOf(id));
            if (!uploadPathFolder.exists()) {
                uploadPathFolder.mkdir();
            }

                User user = userService.searchByKakaoId(id);

                Path path = Paths.get(savePath);
                file.transferTo(path);
            //이미 등록된 사진이 있으면 삭제
//            if(userRepository.findOneByKakaoId(id)!=null){
//               user.setImagePath("");
//               userRepository.save(user);
//            }
//            Path copyOfLocation = Paths.get(uploadDir + File.separator + StringUtils.cleanPath(file.getOriginalFilename()));
//            //저장될 경로
////          String filePath = savePath + "\\" + id + "." + extractExt(file.getOriginalFilename());
//            String filePath = "/var/lib/jenkins/jeju/" +  id + "." + extractExt(file.getOriginalFilename());
//
//            File newfile = new File("/var/lib/jenkins/jeju" );
////            Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
////            Files.copy(file.getInputStream(), copyOfLocation, StandardCopyOption.REPLACE_EXISTING);
//            file.transferTo(newfile);
//            newfile.createNewFile();

            user.setImagePath(savePath);

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

        User targetImage = userRepository.findOneByKakaoId(id);
        if(targetImage!=null){
            File file = new File(targetImage.getImagePath());
            file.delete();
            targetImage.setImagePath("");
            userRepository.save(targetImage);
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