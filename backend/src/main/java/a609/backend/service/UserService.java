package a609.backend.service;

import a609.backend.db.entity.User;

public interface UserService {
    User registUser(User user);
    User searchById(String id);//회원조회
    void deleteUser(String id);
//    void updateUser(User user);//회원 정보 수정
    int idCheck(String id);
    User showInfo(String id);//내 프로필 조회
  //  User login(User user);//로그인



}
