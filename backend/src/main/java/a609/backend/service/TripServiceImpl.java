package a609.backend.service;

import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.db.entity.User;
import a609.backend.db.entity.UserTrip;
import a609.backend.db.repository.ScheduleRepository;
import a609.backend.db.repository.TripRepository;
import a609.backend.db.repository.UserRepository;
import a609.backend.db.repository.UserTripRepository;
import a609.backend.payload.response.FindTripDTO;
import a609.backend.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class TripServiceImpl implements TripService{

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    TripRepository tripRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    UserTripRepository userTripRepository;

    @Override
    public Trip showTripInfo(Long tripId) {
        return tripRepository.findOneByTripId(tripId);
    }


    @Override
    public List<FindTripDTO> showTripList(String token) {
        List<UserTrip> userTripList = userTripRepository.findByUserKakaoId((String)jwtUtil.parseJwtToken(token).get("id"));
        List<FindTripDTO> tripList = new ArrayList<>();
        for (UserTrip userTrip : userTripList) {
            Trip trip = userTrip.getTrip();
            FindTripDTO findTripDTO = new FindTripDTO();
            findTripDTO.setTripId(trip.getTripId());
            findTripDTO.setTripName(trip.getTripName());
            findTripDTO.setPeriodInDays(trip.getPeriodInDays());
            findTripDTO.setStartDate(trip.getStartDate());
            tripList.add(findTripDTO);
        }
        return tripList;
    }

    @Override
    public String registerTrip(Trip trip,String token) {
        Trip savedTrip = tripRepository.save(trip);
        //여행 시작할때 startday에 더미 스케쥴 넣어서 시작시간 조정
        Schedule schedule = new Schedule();
        schedule.setDay(0);
        schedule.setStayTime(trip.getStartTime().toSecondOfDay()/60);
        schedule.setTrip(savedTrip);
        scheduleRepository.save(schedule);
        for(int i=1;i<savedTrip.getPeriodInDays();i++){
            Schedule schedule1 = new Schedule();
            schedule1.setTurn(0);
            schedule1.setDay(i);
            schedule1.setStayTime(540);
            schedule1.setTrip(trip);
            scheduleRepository.save(schedule1);
        }
//        schedule.setPlace("시작용 더미 관광지에 추가해야함");

        User user = userRepository.findOneByKakaoId((String)jwtUtil.parseJwtToken(token).get("id"));
        UserTrip userTrip = new UserTrip();
        userTrip.setTrip(savedTrip);
        userTrip.setUser(user);
        return userTripRepository.save(userTrip).getTrip().getTripId().toString();

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
    public void addUser(Long tripId, String userId) {
        UserTrip userTrip = new UserTrip();
        userTrip.setUser(userRepository.findOneByKakaoId(userId));
        userTrip.setTrip(tripRepository.findOneByTripId(tripId));
        userTripRepository.save(userTrip);

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
    public void deleteUserTrip(Integer tripId, String jwt) {
        String kakaoId= (String)jwtUtil.parseJwtToken(jwt).get("id");
        userTripRepository.deleteByTripTripIdAndUserKakaoId(Long.valueOf(tripId), kakaoId);
    }



}
