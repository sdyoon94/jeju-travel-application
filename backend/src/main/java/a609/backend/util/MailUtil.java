package a609.backend.util;

import org.springframework.stereotype.Component;

import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.ContentType;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Component
public class MailUtil {
    static final String user = "happyhouse14ad@gmail.com";
    static final String password = "ffzszkqqitapfluz";
    static Properties prop = new Properties();
    public MailUtil() {
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", 465);
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.ssl.enable", "true");
        prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
    }

    public void findPassword(String userId, String newPassword){
        Session session = Session.getInstance(prop, new javax.mail.Authenticator(){
            protected PasswordAuthentication getPasswordAuthentication(){
                return new PasswordAuthentication(user, password);
            }
        });

        MimeMessage message = new MimeMessage(session);
        try{
            message.setFrom(new InternetAddress(user));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(userId));
            message.setSubject("임시 비밀번호입니다.");
            message.setText("안녕하세요 임시비밀번호는" + newPassword +"입니다.");
            Transport.send(message);
        } catch (Exception e){
            System.out.println("ERROR!");
            e.printStackTrace();
        }
    }

    public void sendConfirmMail(String userId, String Authkey){
        Session session = Session.getInstance(prop, new javax.mail.Authenticator(){
            protected PasswordAuthentication getPasswordAuthentication(){
                return new PasswordAuthentication(user, password);
            }
        });

        MimeMessage message = new MimeMessage(session);
        try{
            message.setFrom(new InternetAddress(user));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(userId));
            message.setSubject("인증메일입니다.");
//            message.setContent("<form action=\"localhost:8080/api/v1/users/confirm/"+Authkey+"\" method=\"get\">\n<input type=\"submit\" value=\"인증하기\"></form>", "text/html;charset=utf-8");
            message.setContent(" <form action=\"http://localhost:8080/api/v1/users/confirm/"+Authkey+"\" method=\"get\">\n" +
                    "        <input type=\"submit\" value=\"인증하기\">\n" +
                    "    </form>","text/html;charset=utf-8");


            Transport.send(message);
        } catch (Exception e){
            System.out.println("ERROR!");
            e.printStackTrace();
        }

    }

}
