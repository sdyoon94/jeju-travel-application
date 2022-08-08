package a609.backend.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {

    private Long kakaoId;

    private String nickname;

    private String imagePath;


}
