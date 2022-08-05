package a609.backend.service;

import a609.backend.db.entity.Trip;
import a609.backend.db.entity.User;
import a609.backend.db.entity.UserTrip;
import a609.backend.db.repository.TripRepository;
import a609.backend.db.repository.UserRepository;
import a609.backend.db.repository.UserTripRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.persistence.EntityManager;
import java.util.List;

@Slf4j
@Service
public class TripServiceImpl implements TripService{

    @Autowired
    TripRepository tripRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TripScheduleService tripScheduleService;

    @Autowired
    UserTripRepository userTripRepository;

    @Override
    public Trip showTripInfo(Long tripId) {
        return tripRepository.findOneByTripId(tripId);
    }


    //여행방 목록 불러오기 casecade 설정해야 가능할듯..?
//    @Override
//    public List<Trip> showTripList(int userId) {
//       List<Trip> tripList = tripRepository.findAllByUserId(userId);
//
//       return tripList;
//    }

    @Override
    public void registerTrip(Trip trip,String userId) {
        Trip savedTrip = tripRepository.save(trip);
        User user = userRepository.findOneByKakaoId(userId);
        UserTrip userTrip = new UserTrip();
        userTrip.setTrip(savedTrip);
        userTrip.setUser(user);
        userTripRepository.save(userTrip);

//        //여기는 테스트니까 지우던 말던 캡틴 맘대로 하쇼 여행에 참여중인 사람
//        List<UserTrip> userIds = userTripRepository.findByTripTripId(savedTrip.getTripId());
//        for (UserTrip userTrip1 : userIds) {
//            log.info("여행에 참여중인 사람 userTrip1.getUser().getUsername() = " + userTrip1.getUser().getKakaoId());
//        }
//
////        유저가 참여중인 여행 목록
//        List<UserTrip> tripIds = userTripRepository.findByUserKakaoId(userId);
//        for (UserTrip tripId : tripIds) {
//            log.info("유저가 참여중인 여행 목록"+tripId.getTrip().getTripName());
//        }

    }

    @Override
    public void updateTrip(Long tripId,Trip trip) {
        Trip originTrip = tripRepository.findOneByTripId(tripId);
        if(trip.getTripName() != null){
            originTrip.setTripName(trip.getTripName());
        }
        if(trip.getTripMember() != null){
            originTrip.setTripMember(trip.getTripMember());
        }
        if(trip.getBudget() != null){
            originTrip.setBudget(trip.getBudget());
        }
        if(trip.getStartDate() != null){
            originTrip.setStartDate(trip.getStartDate());
        }
        if(trip.getStyle() != null){
            originTrip.setStyle(trip.getStyle());
        }
        tripRepository.save(originTrip);
    }

    @Override
    public void deleteTrip(Long tripId) {
        tripRepository.deleteTripByTripId(tripId);
    }

    @Override
    public void deleteUserTrip(int userId) {
        //trip의 tripmember를 불러와 유저id만 삭제해야됨
    }



}
