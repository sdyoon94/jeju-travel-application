package a609.backend.service;

import a609.backend.db.entity.*;
import a609.backend.db.repository.ScheduleRepository;
import a609.backend.db.repository.TripRepository;
import a609.backend.db.repository.UserRepository;
import a609.backend.db.repository.UserTripRepository;
import a609.backend.payload.response.FindTripDTO;
import a609.backend.payload.response.TripInfoDTO;
import a609.backend.payload.response.UserDTO;
import a609.backend.util.Algorithm;
import a609.backend.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.persistence.EntityManager;
import javax.transaction.Transactional;
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

    @Autowired
    TripScheduleService tripScheduleService;

    @Autowired
    Algorithm algorithm;

    @Override
    public FindTripDTO showTripInfo(Long tripId) {
        Trip trip = tripRepository.findOneByTripId(tripId);
        FindTripDTO findTripDTO = new FindTripDTO();
        findTripDTO.setTripId(trip.getTripId());
        findTripDTO.setTripName(trip.getTripName());
        findTripDTO.setStartDate(trip.getStartDate());
        findTripDTO.setPeriodInDays(trip.getPeriodInDays());
        findTripDTO.setBudget(trip.getBudget());
        findTripDTO.setVehicle(trip.getVehicle());
        findTripDTO.setStyle(trip.getStyle());
        //멤버랑
        List<UserTrip> userTrip = userTripRepository.findByTripTripId(trip.getTripId());
        List<UserDTO> user = new ArrayList<>();
        for (UserTrip userTrip1 : userTrip) {
            UserDTO userDTO = new UserDTO();
            userDTO.setKakaoId(userTrip1.getUser().getKakaoId());
            userDTO.setNickname(userTrip1.getUser().getNickname());
            userDTO.setImagePath(userTrip1.getUser().getImagePath());
            user.add(userDTO);
        }


        findTripDTO.setMember(user);




        return findTripDTO;
    }


    @Override
    public TripInfoDTO showTripList(String token) {
        List<UserTrip> userTripList = userTripRepository.findByUserKakaoId((Long)jwtUtil.parseJwtToken(token).get("id"));
        TripInfoDTO tripInfoDTO = new TripInfoDTO();
        tripInfoDTO.setUserUid((Long) jwtUtil.parseJwtToken(token).get("id"));
        List<FindTripDTO> tripList = new ArrayList<>();
        List<UserDTO> user = new ArrayList<>();
        TripInfoDTO tripInfoDTO1 = new TripInfoDTO();
        for (UserTrip userTrip : userTripList) {
            Trip trip = userTrip.getTrip();
//            TripInfoDTO tripInfoDTO1 = new TripInfoDTO();
            FindTripDTO findTripDTO = new FindTripDTO();
            findTripDTO.setTripId(trip.getTripId());
            findTripDTO.setTripName(trip.getTripName());
            findTripDTO.setStartDate(trip.getStartDate());
            findTripDTO.setPeriodInDays(trip.getPeriodInDays());
            findTripDTO.setBudget(trip.getBudget());
            findTripDTO.setVehicle(trip.getVehicle());
            findTripDTO.setStyle(trip.getStyle());

            //멤버랑
            List<UserTrip> userTrip2 = userTripRepository.findByTripTripId(trip.getTripId());
            List<UserDTO> user2 = new ArrayList<>();
            for (UserTrip userTrip1 : userTrip2) {
                UserDTO userDTO = new UserDTO();
                userDTO.setKakaoId(userTrip1.getUser().getKakaoId());
                userDTO.setNickname(userTrip1.getUser().getNickname());
                userDTO.setImagePath(userTrip1.getUser().getImagePath());
                user2.add(userDTO);
            }
            findTripDTO.setMember(user2);


            tripList.add(findTripDTO);
//            tripInfoDTO.setUserUid((Long) jwtUtil.parseJwtToken(token).get("id"));
//            tripInfoDTO.setTripList(tripList);
//            tripInfoDTO=tripInfoDTO1;
            ////
             }
        tripInfoDTO.setTripList(tripList);
//        tripInfoDTO.add(tripInfoDTO1);
        return tripInfoDTO;
    }

    @Override
    public String registerTrip(Trip trip,String token) {
        User user = userRepository.findOneByKakaoId((Long)jwtUtil.parseJwtToken(token).get("id"));
        Trip trip1 = trip;
        trip1.setTripName(user.getNickname()+"의 여행");
        //방장권한도 줘야됨
        Trip savedTrip = tripRepository.save(trip1);

        UserTrip userTrip = new UserTrip();
        userTrip.setTrip(savedTrip);
        userTrip.setUser(user);

        for(int i=0;i<savedTrip.getPeriodInDays();i++){
            tripScheduleService.registerSchedule(savedTrip,i);
        }

        return userTripRepository.save(userTrip).getTrip().getTripId().toString();


    }

    @Override
    public void addUser(Long tripId, String token) {
        UserTrip userTrip = new UserTrip();
        userTrip.setUser(userRepository.findOneByKakaoId((Long)jwtUtil.parseJwtToken(token).get("id")));
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


    @Transactional
    @Override
    public void deleteUserTrip(Long tripId, String jwt) {
        Long kakaoId= (Long)jwtUtil.parseJwtToken(jwt).get("id");
        userTripRepository.deleteByTripTripIdAndUserKakaoId(tripId, kakaoId);
    }



}
