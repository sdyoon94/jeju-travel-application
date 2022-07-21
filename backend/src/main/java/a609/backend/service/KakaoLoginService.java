package a609.backend.service;

import a609.backend.db.entity.User;

public interface KakaoLoginService {
    String login(String code);
}
