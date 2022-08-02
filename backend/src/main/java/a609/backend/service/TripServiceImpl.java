package a609.backend.service;

import a609.backend.db.entity.Trip;
import a609.backend.db.entity.User;
import a609.backend.db.entity.UserTrip;
import a609.backend.db.repository.TripRepository;
import a609.backend.db.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


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

    @Override
    public Trip showTripInfo(int tripId) {
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

        trip.setStyle(2);
        User user = userRepository.findOneByKakaoId(userId);
        log.info("트립"+trip.toString());
        UserTrip userTrip = new UserTrip();
        user.getUsersTrip().add(userTrip);
        trip.getTripMember().add(userTrip);

        Trip saveTrip = tripRepository.save(trip);

        userRepository.save(user);
        tripScheduleService.registerSchedule(saveTrip);

    }

    @Override
    public void updateTrip(int tripId,Trip trip) {
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
    public void deleteTrip(int tripId) {
        tripRepository.deleteTripByTripId(tripId);
    }

    @Override
    public void deleteUserTrip(int userId) {
        //trip의 tripmember를 불러와 유저id만 삭제해야됨
    }



}
