package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;

@Service
public class FileServiceImpl implements FileService{
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Override
    public void uploadFile(MultipartFile file, String email) {
        try {
            // 실행되는 위치의 'files' 폴더에 파일이 저장됩니다.
            String savePath = System.getProperty("user.dir") + "\\files";
            // 파일이 저장되는 폴더가 없으면 폴더를 생성합니다.
            if (!new File(savePath).exists()) {
                new File(savePath).mkdir();
            }

            User user = userService.searchByUserEmail(email);

            //이미 등록된 사진이 있으면 삭제
            if(userRepository.findOneByUserEmail(email)!=null){
               user.setImagePath("");
               userRepository.save(user);
            }

            //저장될 경로
            String filePath = savePath + "\\" + email + "." + extractExt(file.getOriginalFilename());

            file.transferTo(new File(filePath));


            user.setImagePath(filePath);

            userRepository.save(user);
        } catch (Exception e) {

        }
    }

    @Override
    public User findImageByEmail(String email) {

        return userRepository.findOneByUserEmail(email);
    }

    @Override
    public int deleteByEmail(String email) {

        User targetImage = this.findImageByEmail(email);
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

    // 확장자 추출
    private String extractExt(String originalFilename) {
        int pos = originalFilename.lastIndexOf(".");
        return originalFilename.substring(pos + 1);
    }
}