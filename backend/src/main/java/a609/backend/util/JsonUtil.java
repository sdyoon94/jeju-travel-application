package a609.backend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.tomcat.util.json.JSONParser;


import java.io.*;
import java.net.HttpURLConnection;

import java.net.URL;

public class JsonUtil {
    public static void main(String[] args) throws IOException {

        File file = new File("C://DataCrawl.txt");
        file.createNewFile();
        FileWriter fileWriter = new FileWriter(file);
        BufferedWriter bw = new BufferedWriter(fileWriter);

        int cnt=0;
        for(int page=1;page<=44;page++){
            URL url = new URL("http://api.visitjeju.net/vsjApi/contents/searchList?apiKey=5nwd9dpol4ji9jmy&locale=kr&page="+page);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line=null;
            while((line=br.readLine())!=null){
                sb.append(line);
            }
            JsonObject jsonObject = JsonParser.parseString(sb.toString()).getAsJsonObject();
            JsonArray items = jsonObject.getAsJsonArray("items");

            for(JsonElement element : items){
                try {
                    ++cnt;
                    JsonObject ob = element.getAsJsonObject();
                    if (ob.get("alltag").isJsonNull()) continue;
                    else {
                        String title = ob.get("title").toString();
                        String contentsid = ob.get("contentsid").toString();
                        String label = ob.getAsJsonObject("contentscd").get("label").toString();
                        String roadaddress = ob.get("roadaddress").toString();
                        String latitude = ob.get("latitude").toString();
                        String longitude = ob.get("longitude").toString();
                        String imgpath = "null";
                        if (!ob.getAsJsonObject("repPhoto").isJsonNull()) {
                            imgpath = ob.getAsJsonObject("repPhoto").getAsJsonObject("photoid").get("imgpath").toString();
                        }
                        String alltag = ob.get("alltag").toString();
                        fileWriter.write(title + "," + contentsid + "," + label + "," + roadaddress + "," + latitude + "," + longitude + "," + imgpath + "," + alltag + "\n");
                    }
                }catch(Exception e){
                    System.out.println(cnt);
                }
            }


        }

//
//        Reader reader = new FileReader("C:\\data.txt");
//        JsonObject jsonObject = JsonParser.parseReader(reader).getAsJsonObject();
//        JsonArray items = jsonObject.getAsJsonArray("items");
//
//        for(JsonElement element : items){
//            cnt+=1;
//            System.out.println(element);
//        }
//        System.out.println(cnt);

    }

}
