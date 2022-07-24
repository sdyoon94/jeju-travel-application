package a609.backend.db.repository;

import a609.backend.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User save(User user);
    User findOneByUserEmail(String userEmail);
    @Transactional
    void deleteByUserEmail(String userEmail);
    int countByUserEmail(String userEmail);
//    User findByAuthkey(String Authkey);
    // User updateUser(User user);
    //  User login(User user);
}
