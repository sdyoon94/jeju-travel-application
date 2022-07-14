package a609.backend.controller;

import a609.backend.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class JwtController {

    private final JwtUtil jwtUtil;

    @GetMapping(value = "/tokenCreate/{userId}")
    public TokenResponse createToken(@PathVariable("userId") String userId) throws Exception {
        String token = jwtUtil.createToken(userId); // 토큰 생성
        Claims claims = jwtUtil.parseJwtToken(token); // 토큰 검증

        TokenDataResponse tokenDataResponse = new TokenDataResponse(token, claims.getSubject(), claims.getIssuedAt().toString(), claims.getExpiration().toString());
        TokenResponse tokenResponse = new TokenResponse("200", "OK", tokenDataResponse);

        return tokenResponse;
    }

    @GetMapping(value = "/checkToken")
    public TokenResponse checkToken(@RequestHeader(value = "Authorization") String token) throws Exception {
        Claims claims = jwtUtil.parseJwtToken(token);

        TokenDataResponse tokenDataResponse = new TokenDataResponse(token, claims.getSubject(), claims.getIssuedAt().toString(), claims.getExpiration().toString());
        TokenResponse tokenResponseData = new TokenResponse("200", "success", tokenDataResponse);
        return tokenResponseData;
    }

    @Data
    @AllArgsConstructor
    static class TokenResponse<T> {

        private String code;
        private String msg;
        private T data;
    }

    @Data
    @AllArgsConstructor
    static class TokenDataResponse {
        private String token;
        private String subject;
        private String issued_time;
        private String expired_time;
    }
}