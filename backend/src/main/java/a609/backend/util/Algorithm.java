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

//    public Place create(Trip trip,String placeType,int cnt){
//
//        List<Place> place= placeRepository.findAllByPlaceType(placeType);
//        Collections.shuffle(place);
//
//
//        return  place.get(0);
//    }
    //코드정리test
    public Place create(Trip trip,String placeType,int day,int cnt){

        List<Place> place= placeRepository.findAllByPlaceType(placeType);
        Collections.shuffle(place);
        for (int i=1;i<=cnt;i++) {
            Schedule schedule = new Schedule();
            schedule.setDay(day);
            schedule.setTrip(trip);
            schedule.setPlace(place.get(i-1));
            schedule.setTurn(i);
            scheduleRepository.save(schedule);
        }

        return  place.get(0);
    }


}
