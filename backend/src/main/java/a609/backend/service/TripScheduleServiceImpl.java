package a609.backend.service;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Trip;
import a609.backend.db.entity.Schedule;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.ScheduleRepository;
import a609.backend.payload.response.ScheduleDTO;
import a609.backend.util.Algorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class TripScheduleServiceImpl implements TripScheduleService{

    @Autowired
    Algorithm algorithm;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    PlaceRepository placeRepository;

    @Override
    public void registerSchedule(Trip trip,int day,int[] visit) {
            //test
        int turn = 0;
        double hungry=0.0;
        int tire=0, restaurant=0, cafe=0;
        int placeType=0;

//        Check check = new Check(0.0,0,0,0);

        if (day == 0) {//첫째날

            turn = algorithm.create(trip, 5, day, 1, turn,visit,hungry,tire,restaurant,cafe).getTurn();//공항

            double startTime = trip.getStartTime().toSecondOfDay() / 60/60;//확인필요
            log.info("확인필요 --------"+startTime);
            hungry=startTime;

            while(hungry<20.0) {//8시 이전이면
                placeType=0;
                if (hungry>=11.5&& hungry<13.5&&restaurant<1){
                    placeType=3;
                }
                if (hungry>=17.5&&hungry<19.5&&restaurant<2){
                    placeType=3;
                }
                Algorithm.Check ch = algorithm.create(trip, placeType, day, 1, turn, visit, hungry,tire,restaurant,cafe);//관광지 추가
                hungry= ch.getHungry();
                turn=ch.getTurn();
                restaurant=ch.getRestaurant();
                cafe=ch.getCafe();
            }

//            turn = algorithm.create(trip, 0, day, 2, turn,visit,hungry,tire,restaurant,cafe);//관광지추가
            if (trip.getPeriodInDays() > 1) {//당일치기 아니면 숙소추가
                algorithm.create(trip, 2, day, 1, turn,visit,hungry,tire,restaurant,cafe);
            }
            if (trip.getPeriodInDays() == 1) {//당일치기면 공항
                algorithm.create(trip, 5, day, 1, turn,visit,hungry,tire,restaurant,cafe);//공항
            }
        } else if (day == trip.getPeriodInDays() - 1) {//마지막날
            hungry=9;
            int endTime = trip.getEndTime().toSecondOfDay() / 60/60;
            while(hungry<endTime-2) {//8시 이전이면
                placeType=0;
                if (hungry>=11.5&& hungry<13.5&&restaurant<1){
                    placeType=3;
                }
                if (hungry>=17.5&&hungry<19.5&&restaurant<2){
                    placeType=3;
                }
                Algorithm.Check ch = algorithm.create(trip, placeType, day, 1, turn, visit, hungry,tire,restaurant,cafe);//관광지 추가
                hungry= ch.getHungry();
                turn=ch.getTurn();
                restaurant=ch.getRestaurant();
                cafe=ch.getCafe();
            }

//            turn = algorithm.create(trip, 0, day, 2, turn,visit,hungry,tire,restaurant,cafe);//관광지 추가
            algorithm.create(trip, 5, day, 1, turn,visit,hungry,tire,restaurant,cafe);//공항

        } else {

            hungry=9.0;
            while(hungry<20.0) {//8시 이전이면
                log.info("Hungry -------------------"+hungry);
                placeType=0;
                if(hungry>=11.5&& hungry<13.5&&restaurant<1){
                    placeType=3;
                }
                if (hungry>=17.5&&hungry<19.5&&restaurant<3){
                    placeType=3;
                }
                Algorithm.Check ch = algorithm.create(trip, placeType, day, 1, turn, visit, hungry,tire,restaurant,cafe);//관광지 추가
                hungry= ch.getHungry();
                turn=ch.getTurn();
                restaurant=ch.getRestaurant();
                cafe=ch.getCafe();//관광지 추가
            }
            algorithm.create(trip, 2, day, 1, turn,visit,hungry,tire,restaurant,cafe);//숙소
        }


    }

    @Override
    public void updateSchedule() {

    }

    @Override
    public List<ScheduleDTO> showTripSceduleList(Long tripId, int day) {
        List<Schedule> schedules = scheduleRepository.findByTripTripIdAndDayOrderByTurn(tripId,day);
        List<ScheduleDTO> scheduleList = new ArrayList<>();
        for (Schedule schedule : schedules) {

            scheduleList.add(ScheduleDTO.builder().placeName(schedule.getPlaceName()).placeUid(schedule.getPlaceUid())
                            .stayTime(schedule.getStayTime()).lat(schedule.getLat()).lng(schedule.getLng()).build());
        }
        return scheduleList;
    }

}
