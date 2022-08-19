package a609.backend.util;

import a609.backend.db.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    public String generateJwtToken(Long kakaoId, String nickname, String imagePath) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + 3 * 60 * 60 * 1000L);

        Map<String, Object> headers = headersSetting();
        Map<String, Object> payloads = new HashMap<>();
        payloads.put("id", kakaoId);
        payloads.put("nickname", nickname);
        payloads.put("image_path", imagePath);

        return Jwts.builder()
                .setHeader(headers)
                .setClaims(payloads)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes()) // 알고리즘, 시크릿 키
                .compact();
    }

    public String generateJwtToken(User user) {
        return generateJwtToken(user.getKakaoId(), user.getNickname(), user.getImagePath());
    }

    public String generateRefreshToken(Long kakaoId){
        Date now = new Date();
        Date expiration = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000L);

        Map<String, Object> headers = headersSetting();
        Map<String, Object> payloads = new HashMap<>();
        payloads.put("id", kakaoId);

        return Jwts.builder()
                .setHeader(headers)
                .setClaims(payloads)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())
                .compact();
    }

    public Map<String, Object> headersSetting(){
        Map<String, Object> headers = new HashMap<>();
        headers.put("typ", "JWT");
        headers.put("alg", "HS256");
        return headers;
    }

    public Claims parseJwtToken(String token) {
        Claims claims = null;
        token = token.split(" ")[1];
        try{
            claims = Jwts.parser()
                    .setSigningKey(secretKey.getBytes("UTF-8"))
                    .parseClaimsJws(token)
                    .getBody();
        } catch(Exception e){
            System.out.println(e);
        }
        return claims;
    }

    public HttpStatus validateJwtToken(String authToken){
        try{
            authToken = authToken.split(" ")[1];
            log.info("토큰 : {}", authToken);
            Jwts.parser().setSigningKey(secretKey.getBytes("UTF-8")).parseClaimsJws(authToken);
            return HttpStatus.OK;
        }catch (ExpiredJwtException e){
            return HttpStatus.UNAUTHORIZED;
        }catch (Exception e){
            return HttpStatus.BAD_REQUEST;
        }
    }
}