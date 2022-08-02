package a609.backend.service;

import a609.backend.db.entity.Day;
import a609.backend.db.entity.Trip;
import a609.backend.db.entity.Schedule;
import a609.backend.db.repository.DayRepository;
import a609.backend.db.repository.ScheduleRepository;
import a609.backend.util.Algorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class TripScheduleServiceImpl implements TripScheduleService{

    @Autowired
    Algorithm algorithm;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    DayRepository dayRepository;

    @Override
    public void registerSchedule(Trip saveTrip) {

        //day생성


        for (int i =1; i<=saveTrip.getPeriod();i++){
            Day day = new Day();
            day.setTripId(saveTrip.getTripId());
            day.setDay(i);
            day.setStartTime(null); //9시로 디폴트 시간 설정
            if (i==1){
                day.setStartTime(saveTrip.getStartTime());
            } else if (i==saveTrip.getPeriod()) {
                day.setEndtTime(saveTrip.getEndTime());
            }
            Day saveDay = dayRepository.save(day);

            //몇개 일정 뽑을지..?for문반복?
            Schedule schedule = new Schedule();
            schedule.setDayId(saveDay.getDayId());
            schedule.setPlaceId(algorithm.create(saveTrip));//알고리즘으로 뽑기
            scheduleRepository.save(schedule);
        }

    }

    @Override
    public void updateSchedule() {

    }
}
