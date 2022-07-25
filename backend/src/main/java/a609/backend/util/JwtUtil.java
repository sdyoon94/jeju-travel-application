package a609.backend.util;

import a609.backend.db.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    public String generateJwtToken(Authentication authentication, boolean keep) {
        User userPrincipal = (User) authentication.getPrincipal();
        Date now = new Date();
        Date expiration = keep ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000L) : new Date(now.getTime() + 6 * 60 * 60 * 1000L); // 만료기간 2주 or 6시간

        Map<String, Object> headers = new HashMap<>();
        headers.put("typ", "JWT");
        headers.put("alg", "HS256");

        Map<String, Object> payloads = new HashMap<>();
        payloads.put("id", userPrincipal.getUserEmail());
        payloads.put("nickname", userPrincipal.getNickname());

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