package a609.backend;

import a609.backend.db.entity.User;
import a609.backend.db.repository.UserRepository;
import a609.backend.service.UserService;
import a609.backend.service.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

@SpringBootTest
class BackendApplicationTests {
	@Autowired
	UserRepository userRepository;

	@Test
	void contextLoads() {
	}

	@Test
	@Rollback(value = false)
	void userInsert(){
		User user= new User();
		user.setUserEmail("Tester@test.com");
		user.setNickname("tester");
		System.out.println(user.toString());
		userRepository.save(user);
	}

}
