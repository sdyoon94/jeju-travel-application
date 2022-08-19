package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import a609.backend.util.JwtUtil;
import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifIFD0Directory;
import lombok.extern.slf4j.Slf4j;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
public class FileServiceImpl implements FileService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;


    @Override
    public void uploadFile(MultipartFile file, String token) {
        Long id = ((Long) jwtUtil.parseJwtToken(token).get("id"));


        String uploadPath = File.separator + "profile_images" + File.separator + id;
//        String dbPath = File.separator + "saimedia" + File.separator + "Album";

        try {
            // 실행되는 위치의 'files' 폴더에 파일이 저장됩니다.
//            String savePath = System.getProperty("user.dir") + "\\files";
            String savePath = uploadPath + File.separator + id + "." + extractExt(file.getOriginalFilename());
//            String savePath = uploadPath + File.separator + id + "." + extractExt(file.getOriginalFilename());
//            String TestSavePath = uploadPath + File.separator + id + File.separator + id + "." + extractExt(file.getOriginalFilename());


            // 파일이 저장되는 폴더가 없으면 폴더를 생성합니다.
//            File uploadPathFolder = new File(uploadPath, String.valueOf(id));
//            if (!uploadPathFolder.exists()) {
//                uploadPathFolder.mkdir();
//            }
            //r경로
            User user = userService.searchByKakaoId(id);

            //이미 등록된 사진이 있으면 삭제
//            if (userRepository.findOneByKakaoId(id).getDbImagePath() != null) {
//                this.deleteById(token);
//            }
            File check = new File(uploadPath);
            if (check.exists()) {
                File[] folder_list = check.listFiles(); //파일리스트 얻어오기

                for (int j = 0; j < folder_list.length; j++) {
                    folder_list[j].delete();
                }
                if(folder_list.length == 0 && check.isDirectory()){
                    check.delete();
                }
            }
            check.mkdir();
            Path path = Paths.get(savePath);
            file.transferTo(path);

//            //이미지 줄이기 test
            // 이미지 리사이징
            resizeImageFile(file, savePath, extractExt(file.getOriginalFilename()));

//            user.setImagePath("http://i7a609.p.ssafy.io:8080" + savePath);
            user.setImagePath("https://i7a609.p.ssafy.io/api/images" + savePath);


            userRepository.save(user);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public User findImageById(String token) {
        Long id = ((Long) jwtUtil.parseJwtToken(token).get("id"));

        return userRepository.findOneByKakaoId(id);
    }



    private String uploadDir = System.getProperty("user.dir") + "\\files";


    // 확장자 추출
    private String extractExt(String originalFilename) {
        int pos = originalFilename.lastIndexOf(".");
        return originalFilename.substring(pos + 1);
    }

    // 이미지 크기 줄이기
    private void resizeImageFile(MultipartFile file, String filePath, String formatName) throws Exception {
        // 이미지 읽어 오기
        BufferedImage inputImage = ImageIO.read(file.getInputStream());
        // 이미지 세로 가로 측정

        int rotate = 1;


        // 이미지 품질 설정
// Image.SCALE_DEFAULT : 기본 이미지 스케일링 알고리즘 사용
// Image.SCALE_FAST : 이미지 부드러움보다 속도 우선
// Image.SCALE_REPLICATE : ReplicateScaleFilter 클래스로 구체화 된 이미지 크기 조절 알고리즘
// Image.SCALE_SMOOTH : 속도보다 이미지 부드러움을 우선
// Image.SCALE_AREA_AVERAGING : 평균 알고리즘 사용

        //회전후 저장 위해 메타데이터 읽기
        try {
            Metadata metadata = ImageMetadataReader.readMetadata(file.getInputStream());
            Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
            if (directory != null) {
                rotate = directory.getInt(ExifIFD0Directory.TAG_ORIENTATION);
            }
        } catch (Exception e) {
            System.out.println("메타데이터 읽기에서 에러났다아아아");
            e.printStackTrace();
        }
        switch (rotate) {
            case 6:
                inputImage = Scalr.rotate(inputImage, Scalr.Rotation.CW_90);
                break;
            case 3:
                inputImage = Scalr.rotate(inputImage, Scalr.Rotation.CW_180);
                break;
            case 8:
                inputImage = Scalr.rotate(inputImage, Scalr.Rotation.CW_270);
        }
        int originWidth = inputImage.getWidth();
        int originHeight = inputImage.getHeight();
        // 변경할 가로 길이
        int newWidth = 500;
        if (originWidth > newWidth) {
            // 기존 이미지 비율을 유지하여 세로 길이 설정
            int newHeight = (originHeight * newWidth) / originWidth;

            Image resizeImage = inputImage.getScaledInstance(newWidth, newHeight, Image.SCALE_FAST);
            BufferedImage newImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
            Graphics graphics = newImage.getGraphics();
            graphics.drawImage(resizeImage, 0, 0, null);
            graphics.dispose();
            // 이미지 저장
            File newFile = new File(filePath);
            ImageIO.write(newImage, formatName, newFile);
        } else {
            file.transferTo(new java.io.File(filePath));
        }
    }
}