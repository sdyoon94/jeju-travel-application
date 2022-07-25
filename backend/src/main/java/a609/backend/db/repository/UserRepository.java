package a609.backend.db.repository;

import a609.backend.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User save(User user);
    User findOneByUserEmail(String userEmail);
    void deleteByUserEmail(String id);
    int countByUserEmail(String id);
//    User findByAuthkey(String Authkey);
    // User updateUser(User user);
    //  User login(User user);
}
