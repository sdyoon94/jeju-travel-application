package a609.backend.util;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.ScheduleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class Algorithm {

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    ScheduleRepository scheduleRepository;

    public int create(Trip trip,int placeType,int day,int cnt,int startTurn){

        for (int i=0;i<cnt;i++) {
            Schedule schedule = new Schedule();
            schedule.setDay(day);
            schedule.setTrip(trip);
            if(placeType==5){//공항이면
                Place place = new Place();
                place.setPlaceUid(1L);
                schedule.setPlace(place);
                if (day==0 && startTurn==0){//첫쨋날 시작시간 지정
                    schedule.setStayTime(trip.getStartTime().toSecondOfDay()/60);
                }else{
                    schedule.setStayTime(trip.getEndTime().toSecondOfDay()/60);
                }


            }else if (startTurn==0){//0번째 일정은 9시로 시작시간 설정하고 전날 잡은 숙소로 장소 설정
                Place place = new Place();
                int turn= Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(trip.getTripId(), day-1));
                place = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(),day-1,turn-1).getPlace();//전날 숙소를 시작장소로
                schedule.setPlace(place);//전날 잡은 숙소로
                schedule.setStayTime(540);
            }else {

                schedule.setPlace(selectPlace(33.5066211, 126.49281, placeType));
            }


            schedule.setTurn(startTurn++);
            scheduleRepository.save(schedule);
        }
        return startTurn;

    }

    //이전 장소 반경 내 장소 선택
    public Place selectPlace(double lat, double lng,int placeType){//인자 스타일 추가

        List<Place> places = new ArrayList<>();
        if(placeType==0) {//관광지
            places = placeRepository.findTourByDistance(lat, lng, 60.0);

        }else if(placeType==3){//음식점
            places = placeRepository.findBobByDistance(lat, lng, 60.0);

        }else {//숙소
           places = placeRepository.findHotelByDistance(lat, lng, 60.0);

        }
        Collections.shuffle(places);

//        List<Place> findPlaceByType= placeRepository.findAllByPlaceType(placeType);
//        Collections.shuffle(findPlaceByType);
//        resultPlace = findPlaceByType.get(0);

     return places.get(0);
    }


}
