package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import a609.backend.util.EncryptUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;

    @Override
    public User registUser(User user) {
        String encryPassword = EncryptUtil.encrypt(user.getPassword());
        user.setPassword(encryPassword);
        return userRepository.save(user);
    }

    @Override
    public User searchById(String id) {
        return userRepository.findOneById(id);
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(id);

    }

//    @Override
//    public void updateUser(User user) {
//        userRepository.updateUser(user);
//    }

    @Override
    public int idCheck(String id) {
        return userRepository.countById(id);
    }

    @Override
    public User showInfo(String id) {
        return userRepository.findOneById(id);
    }

//    @Override
//    public User login(User user) {

//        return userRepository.login(user);
//    }
}
