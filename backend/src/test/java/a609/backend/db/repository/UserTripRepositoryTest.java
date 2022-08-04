package a609.backend.db.repository;

import a609.backend.db.entity.Trip;
import a609.backend.db.entity.User;
import a609.backend.db.entity.UserTrip;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class UserTripRepositoryTest {

    @Autowired
    UserTripRepository userTripRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TripRepository tripRepository;


    @Test
    public void UserDeleteTest(){
        basecreate();
        List<UserTrip> userTrips = userTripRepository.findByUserKakaoId("1");
        Assertions.assertEquals(1,userTrips.size());
        //4. delete 확인
        //Trip을 delete하면 userTrip은 저절로 삭제되어야한다(cascade)
        //User를 삭제해도 userTrip은 저절로 삭제되어야한다.

        userRepository.deleteUserByKakaoId("1");
        userTrips = userTripRepository.findByUserKakaoId("1");
        Assertions.assertEquals(0, userTrips.size());
        
    }

    @Test
    public void TripDeleteTest(){
        basecreate();
        List<UserTrip> userTrips = userTripRepository.findByUserKakaoId("1");
        Assertions.assertEquals(1,userTrips.size());

        tripRepository.deleteTripByTripId(userTrips.get(0).getTrip().getTripId());
        userTrips = userTripRepository.findByUserKakaoId("1");

        Assertions.assertEquals(0, userTrips.size());


    }

    private void basecreate() {
        User user= new User();
        user.setKakaoId("1");
        user.setNickname("감자");
        user.setImagePath("fakePath");
        userRepository.save(user);
        Trip trip= new Trip();
        trip.setTripName("감자의여행");
        trip.setPeriod(3);
        tripRepository.save(trip);

        //1. user가 들어갔는지 확인한다.

        //2. trip은 확인할 방법이 없다??? 그냥 돌린다????

        //3. Usertrip 생성 및 fk 확인

        UserTrip usertrip = new UserTrip();
        usertrip.setUser(user);
        usertrip.setTrip(trip);
        userTripRepository.save(usertrip);
    }
}