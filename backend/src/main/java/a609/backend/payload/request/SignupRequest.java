package a609.backend.payload.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel(value = "Sign-up request", description = "회원가입 할 때 전달되는 파라미터입니다.")
public class SignupRequest {
    @ApiModelProperty(name = "id", example = "ssafy@ssafy.com")
    String id;
    @ApiModelProperty(name = "password", example = "1q2w3e4r")
    String password;
    @ApiModelProperty(name = "nickname", example = "귀여운아치")
    String nickname;
}
