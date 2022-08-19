package a609.backend.payload.response;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MessageResponse {
    @ApiModelProperty(name = "message", example = "잘못된 요청입니다.")
    String message;
}
