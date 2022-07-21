package a609.backend.payload.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel(value = "Login Request", description = "로그인 할 때 전달되는 파라미터입니다.")
public class LoginRequest {
    @ApiModelProperty(name = "ID", example = "ssafy@ssafy.com")
    String id;
    @ApiModelProperty(name = "Password", example = "1q2w3e4r")
    String password;
}
