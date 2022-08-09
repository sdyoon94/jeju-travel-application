package a609.backend.util;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

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
            }else {
                schedule.setPlace(selectPlace(33.5066211, 126.49281, 0));
            }
            schedule.setTurn(startTurn);
            startTurn++;
            scheduleRepository.save(schedule);
        }
        return startTurn;

    }

    //이전 장소 반경 내 장소 선택
    public Place selectPlace(double lat, double lng,int placeType){//인자 스타일 추가
        List<Place> findTourByDistance= placeRepository.findTourByDistance(lat,lng,60.0);
        Collections.shuffle(findTourByDistance);

        List<Place> findPlaceByType= placeRepository.findAllByPlaceType(placeType);
//        Collections.shuffle(place);

     return findTourByDistance.get(0);
    }


}
