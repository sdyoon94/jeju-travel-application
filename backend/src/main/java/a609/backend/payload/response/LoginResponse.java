package a609.backend.payload.response;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@ApiModel(value = "Login Response", description = "로그인 요청에 대한 응답 값입니다.")
public class LoginResponse {
    @ApiModelProperty(name = "JWT 토큰")
    String accessToken;
    @ApiModelProperty(name = "ID", example = "ssafy@ssafy.com")
    String id;
    @ApiModelProperty(name = "Nickname", example = "귀여운아치")
    String nickname;
    @ApiModelProperty(name = "권한", example = "0 : 미인증 회원, 1 : 인증 회원, 2 : 관리자")
    int authority;
}
