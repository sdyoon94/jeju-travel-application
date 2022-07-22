package a609.backend.util;
import com.google.gson.JsonParser;
import com.google.gson.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@Component
public class KaKaoUtil {

    @Value("${restapi.key}")
    private String secretKey;

    public Map<String, Object> getAccessToken(String code) {
        Map<String, Object> resultMap = new HashMap<>();
        String accessToken = "";
        String refreshToken = "";


        String reqURL = "https://kauth.kakao.com/oauth/token";

        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            //    POST 요청에 필요로 요구하는 파라미터 스트림을 통해 전송
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder();
            sb.append("grant_type=authorization_code");
            sb.append("&client_id="+secretKey);
            sb.append("&redirect_uri=http://localhost:8080/api/oauth/kakao/login");
            sb.append("&code="+code);

            bw.write(sb.toString());
            bw.flush();

            //결과코드 200이면 성공
            int responseCode = conn.getResponseCode();
            System.out.println("response code = " + responseCode);

            //요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String line = "";
            String result = "";
            while((line = br.readLine())!=null) {
                result += line;
            }
            System.out.println("response body="+result);

            JsonObject jsonObject = JsonParser.parseString(result).getAsJsonObject();
//            JsonParser parser = new JsonParser();
//            JsonElement element = parser.parse(result);

            accessToken = jsonObject.get("access_token").getAsString();
            refreshToken = jsonObject.get("refresh_token").getAsString();

            resultMap.put("accessToken",accessToken);
            resultMap.put("refreshToken",refreshToken);

            //리프레쉬토큰 DB에 저장하기
            log.info("리프레쉬토큰:"+refreshToken);


            br.close();
            bw.close();
        }catch (Exception e) {
            e.printStackTrace();
        }
        return resultMap;
    }


    public HashMap<String, Object> getUserInfo(String accessToken) {
        HashMap<String, Object> userInfo = new HashMap<String, Object>();
        String reqUrl = "https://kapi.kakao.com/v2/user/me";
        try {
            URL url = new URL(reqUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + accessToken);
            int responseCode = conn.getResponseCode();
            System.out.println("responseCode =" + responseCode);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));


            String line = "";
            String result = "";

            while((line = br.readLine()) != null) {
                result += line;
            }
            System.out.println("response body ="+result);

            JsonObject jsonObject = JsonParser.parseString(result).getAsJsonObject();

            JsonObject properties = jsonObject.get("properties").getAsJsonObject();
            JsonObject kakaoAccount = jsonObject.get("kakao_account").getAsJsonObject();

            String imagePath = properties.getAsJsonObject().get("profile_image_url").getAsString();
            String nickname = properties.getAsJsonObject().get("nickname").getAsString();
            String email = kakaoAccount.getAsJsonObject().get("email").getAsString();


            userInfo.put("nickname", nickname);
            userInfo.put("email", email);
            userInfo.put("imagePath",imagePath);


        } catch (Exception e) {
            e.printStackTrace();
        }
        return userInfo;
    }


    public void kakaoLogout(String access_Token) {
        String reqURL = "http://kapi.kakao.com/v1/user/logout";
        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + access_Token);

            int responseCode = conn.getResponseCode();
            System.out.println("responseCode = " + responseCode);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String result = "";
            String line = "";

            while((line = br.readLine()) != null) {
                result+=line;
            }
            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void unlink(String access_Token) {
        String reqURL = "https://kapi.kakao.com/v1/user/unlink";
        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Bearer " + access_Token);

            int responseCode = conn.getResponseCode();
            System.out.println("responseCode : " + responseCode);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String result = "";
            String line = "";

            while ((line = br.readLine()) != null) {
                result += line;
            }
            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String updateAccessToken(String refresh_token) {
        String accessToken = "";
        String refreshToken = "";

        String reqURL = "https://kauth.kakao.com/oauth/token";

        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            //    POST 요청에 필요로 요구하는 파라미터 스트림을 통해 전송
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder();
            sb.append("grant_type=refresh_token");
            sb.append("&client_id="+secretKey);
            sb.append("&refresh_token="+refresh_token);

            bw.write(sb.toString());
            bw.flush();

            //결과코드 200이면 성공
            int responseCode = conn.getResponseCode();
            System.out.println("response code = " + responseCode);

            //요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String line = "";
            String result = "";
            while((line = br.readLine())!=null) {
                result += line;
            }
            System.out.println("response body="+result);

            JsonObject jsonObject = JsonParser.parseString(result).getAsJsonObject();
//            JsonParser parser = new JsonParser();
//            JsonElement element = parser.parse(result);
            log.info("refresh_token여부"+ String.valueOf(jsonObject.has("refresh_token")));
            log.info("access_token여부"+String.valueOf(jsonObject.has("access_token")));
            accessToken = jsonObject.get("access_token").getAsString();

           if(jsonObject.has("refresh_token")){
               refreshToken = jsonObject.get("refresh_token").getAsString();
               //리프레시토큰 DB저장
           }

            br.close();
            bw.close();
        }catch (Exception e) {
            e.printStackTrace();
        }
        return accessToken;
    }
}
