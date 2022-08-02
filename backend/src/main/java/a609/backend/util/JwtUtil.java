package a609.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    public String generateJwtToken(Authentication authentication) {
        log.info("어센티케이션 프린시플엔 무엇이 들었을까? : {}", authentication.getPrincipal().toString());
        OAuth2User userPrincipal = (OAuth2User) authentication.getPrincipal();
        Date now = new Date();
        Date expiration = new Date(now.getTime() + 3 * 60 * 1000L);

        Map<String, Object> headers = new HashMap<>();
        headers.put("typ", "JWT");
        headers.put("alg", "HS256");

        Map<String, Object> payloads = new HashMap<>();
        Map<String, Object> attributes = userPrincipal.getAttributes();
        Map<String, Object> properties = (Map<String, Object>)attributes.get("properties");
        payloads.put("id", userPrincipal.getName());
        payloads.put("nickname", properties.get("nickname"));
        payloads.put("image_path", properties.get("profile_image"));

        return Jwts.builder()
                .setHeader(headers)
                .setClaims(payloads)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes()) // 알고리즘, 시크릿 키
                .compact();
    }

    public Claims parseJwtToken(String token) {
        Claims claims = null;
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

    public boolean validateJwtToken(String authToken){
        try{
            Jwts.parser().setSigningKey(secretKey.getBytes("UTF-8")).parseClaimsJws(authToken);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}