package a609.backend.service;

import a609.backend.db.entity.User;

import javax.servlet.http.HttpSession;

public interface KakaoLoginService {
    String login(String code);
    String logout();
    void deleteUser();
}
