package a609.backend.service;

public interface KakaoLoginService {
    String login(String code);
    String logout(String userEmail);
    void deleteUser(String userEmail);
}
