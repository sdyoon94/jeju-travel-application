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



//    @Override
//    public void registerSchedule(Trip saveTrip) {
//
//        //day생성
//        for (int i =1; i<=saveTrip.getPeriod();i++){
//            Day day = new Day();
//            day.setTripId(saveTrip.getTripId());
//            day.setDay(i);
//            day.setStartTime(null); //9시로 디폴트 시간 설정
//            if (i==1){
//                day.setStartTime(saveTrip.getStartTime());
//            } else if (i==saveTrip.getPeriod()) {
//                day.setEndtTime(saveTrip.getEndTime());
//            }
//            Day saveDay = dayRepository.save(day);
//
//            //몇개 일정 뽑을지..?for문반복?
//            Schedule schedule = new Schedule();
//            schedule.setDayId(saveDay.getDayId());
//            schedule.setTripId(saveTrip.getTripId());
//            schedule.setPlaceId(algorithm.create(saveTrip));//알고리즘으로 뽑기
//            scheduleRepository.save(schedule);
//        }
//
//    }

    @Override
    public void registerSchedule(Trip trip,int day) {
            //test


//        첫째날 마지막날 추천 일정 수 고려해야될듯
//        if(day==0) {//첫째날
//            int startTime = trip.getStartTime().toSecondOfDay() / 60;
//            if (startTime >= 1080) {
//                //6시 이후
//                for (int j = 1; j <= 3; j++) {
//                    schedule.setPlace(algorithm.create(trip,"0"));
//                    schedule.setTurn(j);
//                    scheduleRepository.save(schedule);
//                }
//            }
//        }
//        if (day==trip.getPeriodInDays()-1) {//마지막날
//            int endTime = trip.getEndTime().toSecondOfDay() / 60;
//            if (endTime <= 720) {
//                schedule.setPlace(algorithm.create(trip,"3"));
//                schedule.setTurn(1);
//                scheduleRepository.save(schedule);
//                //12시 이전
//            }
//        }


//            for (int j = 1; j <= 5; j++) {
//                Schedule schedule = new Schedule();
//                schedule.setDay(day);
//                schedule.setTrip(trip);
//                schedule.setPlace(algorithm.create(trip,"0",day,1));
//                schedule.setTurn(j);
//                scheduleRepository.save(schedule);
//            }
        //날짜별
        algorithm.create(trip,"0",day,5);

    }

    @Override
    public void updateSchedule() {

    }

    @Override
    public List<ScheduleDTO> showTripSceduleList(Long tripId, int day) {
        List<Schedule> schedules = scheduleRepository.findByTripTripIdAndDayOrderByTurn(tripId,day);
        List<ScheduleDTO> scheduleList = new ArrayList<>();
        for (Schedule schedule : schedules) {
            Place place =placeRepository.findOneByPlaceUid(schedule.getPlace().getPlaceUid());
            ScheduleDTO sch = new ScheduleDTO();
            sch.setPlaceUid(place.getPlaceUid());
            sch.setPlaceName(schedule.getPlace().getPlaceName());
            sch.setStayTime(schedule.getStayTime());
            sch.setImgPath(place.getImgPath());
            sch.setLat(place.getLat());
            sch.setLng(place.getLng());
            sch.setRoadAddress(place.getRoadAddress());
            scheduleList.add(sch);
        }
        return scheduleList;
    }

//    @Override
//    public List<Schedule> showTripSceduleList(Long tripId) {
//        return scheduleRepository.findAllByTripId(tripId);
//    }
}
