package a609.backend.service;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import a609.backend.util.JwtUtil;
import a609.backend.util.MailUtil;
import io.jsonwebtoken.Claims;
import org.apache.commons.lang3.RandomStringUtils;
import a609.backend.util.EncryptUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findOneById(username);
        if (user == null) throw new UsernameNotFoundException("Not Found account.");

        return user;
    }

    @Autowired
    UserRepository userRepository;

    @Autowired
    MailUtil mailUtil;

    @Autowired
    JwtUtil jwtUtil;


    @Override
    public User registerUser(User user) {
        String authKey = RandomStringUtils.randomAlphanumeric(10);
        user.setAuthkey(authKey);
        mailUtil.sendConfirmMail(user.getId(), authKey);

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

    @Override
    public void updateUser(String id, User user) {
        User originUser = userRepository.findOneById(id);
        String encryptPassword = EncryptUtil.encrypt(user.getPassword());
        if (user.getNickname() != null) {
            originUser.setNickname(user.getNickname());
        }
        if (user.getPassword() != null) {
            originUser.setPassword(encryptPassword);
        }
        userRepository.save(originUser);

    }

    @Override
    public int idCheck(String id) {
        return userRepository.countById(id);
    }

    //    @Override
//    public User login(User user) {
//        return userRepository.login(user);
//    }
    @Override
    public void findPassword(String id) {
        String newPassword = RandomStringUtils.randomAlphanumeric(10);
        User user = searchById(id);
        user.setPassword(newPassword);
        registerUser(user);
        mailUtil.findPassword(id, newPassword);
    }

    @Override
    public String login(User user) {

        User loginUser = userRepository.findOneById(user.getId());
        if (loginUser != null) {

            String encryptPassword = loginUser.getPassword();
            boolean match = EncryptUtil.isMatch(user.getPassword(), encryptPassword);
            if (match) {
                String token = jwtUtil.createToken(loginUser.getId(), loginUser.getAuthority(), loginUser.getNickname(), true);
                return token;
            }

            return "401";

        } else {
            return "404";
        }
    }

    @Override
    public void confirmUser(String authKey) {
        //중복인증 방지
        if (authKey.equals("confirmed")) return;
        User user = userRepository.findByAuthkey(authKey);
        user.setAuthority(1);
        user.setAuthkey("confirmed");
        userRepository.save(user);
    }

    @Override
    public Claims verifyToken(String token) {
        return jwtUtil.parseJwtToken(token);
    }

    @Override
    public boolean pwCheck(String jwt, String password, String newPassword) {
        Claims claims = jwtUtil.parseJwtToken(jwt);
        String id = (String) claims.get("id");
        User originUser= userRepository.findOneById(id);
        String originPassword = originUser.getPassword();
        boolean result = EncryptUtil.isMatch(password, originPassword);
        if(result){
            originUser.setPassword(EncryptUtil.encrypt(newPassword));
            userRepository.save(originUser);
        }
        return result;

    }
}
