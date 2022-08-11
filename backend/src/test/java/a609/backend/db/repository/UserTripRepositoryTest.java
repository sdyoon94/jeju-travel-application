//package a609.backend.db.repository;
//
//import a609.backend.db.entity.Trip;
//import a609.backend.db.entity.User;
//import a609.backend.db.entity.UserTrip;
//import a609.backend.service.TripService;
//import a609.backend.service.UserService;
//import com.fasterxml.jackson.databind.ser.std.IterableSerializer;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.Assertions;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.List;
//
//@SpringBootTest
//public class UserTripRepositoryTest {
//
//    @Autowired
//    TripService tripService;
//
//    @Autowired
//    UserTripRepository userTripRepository;
//
//    @Autowired
//    UserRepository userRepository;
//
//    @Autowired
//    TripRepository tripRepository;
//
//
//    @Test
//    public void UserDeleteTest(){
//        basecreate();
//        List<UserTrip> userTrips = userTripRepository.findByUserKakaoId("1");
//        Assertions.assertEquals(1,userTrips.size());
//        //4. delete 확인
//        //Trip을 delete하면 userTrip은 저절로 삭제되어야한다(cascade)
//        //User를 삭제해도 userTrip은 저절로 삭제되어야한다.
//
//        userRepository.deleteUserByKakaoId("1");
//        userTrips = userTripRepository.findByUserKakaoId("1");
//        Assertions.assertEquals(0, userTrips.size());
//
//    }
//
//    @Test
//    public void TripDeleteTest(){
//        basecreate();
//        List<UserTrip> userTrips = userTripRepository.findByUserKakaoId("1");
//        Assertions.assertEquals(1,userTrips.size());
//
//        tripRepository.deleteTripByTripId(userTrips.get(0).getTrip().getTripId());
//        userTrips = userTripRepository.findByUserKakaoId("1");
//
//        Assertions.assertEquals(0, userTrips.size());
//
//
//    }
//
//    @Test
//    public void addUserTest(){
//        basecreate();
//        //1. 여행 생성
//        tripService.registerTrip(tripRepository.findOneByTripId(2L), "2");
//        User 소정 = userRepository.findOneByKakaoId("2");
//        List<UserTrip> trips = userTripRepository.findByUserKakaoId(소정.getKakaoId());
//        //2. 여행 들어갔는지 확인
//        Assertions.assertEquals("캡틴의여행", trips.get(0).getTrip().getTripName());
//
//        //3. 감자를 캡틴 여행에 추가한다.
//        //일단 register씀, add 따로 만들지는 모르겠음
//
//
//    }
//    private void basecreate() {
//        User user= new User();
//        user.setKakaoId("1");
//        user.setNickname("감자");
//        user.setImagePath("fakePath");
//        userRepository.save(user);
//
//        User user2 = new User();
//        user2.setKakaoId("2");
//        user2.setNickname("캡틴소정");
//        user2.setImagePath("몰?루");
//        userRepository.save(user2);
//
//        Trip trip= new Trip();
//        trip.setTripName("감자의여행");
//        trip.setPeriod(3);
//        tripRepository.save(trip);
//
//        Trip trip2= new Trip();
//        trip2.setTripName("캡틴의여행");
//        trip2.setPeriod(5);
//        tripRepository.save(trip2);
//        List<Trip> all = tripRepository.findAll();
//        for (Trip trip1 : all) {
//            System.out.println(trip.getTripId());
//        }
//
//        //1. user가 들어갔는지 확인한다.
//
//        //2. trip은 확인할 방법이 없다??? 그냥 돌린다????
//
//        //3. Usertrip 생성 및 fk 확인
//
//        UserTrip usertrip = new UserTrip();
//        usertrip.setUser(user);
//        usertrip.setTrip(trip);
//        userTripRepository.save(usertrip);
//    }
//}