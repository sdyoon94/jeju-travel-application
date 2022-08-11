package a609.backend.service;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Trip;
import a609.backend.db.entity.Schedule;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.ScheduleRepository;
import a609.backend.db.repository.TripRepository;
import a609.backend.payload.response.ScheduleDTO;
import a609.backend.util.Algorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class TripScheduleServiceImpl implements TripScheduleService{

    @Autowired
    Algorithm algorithm;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    TripRepository tripRepository;



    @Override
    public void registerSchedule(Trip trip,int day,int[] visit) {
            //test
        int turn = 0;

        if (day == 0) {//첫째날
            turn = algorithm.create(trip, 5, day, 1, turn,visit);//공항

            int startTime = trip.getStartTime().toSecondOfDay() / 60;
            // 첫째날 마지막날 시간에 따른 추천 일정 수 고려해야될듯
//            if (startTime >= 1080) {//일정추가
//                //6시 이후
//                for (int j = 1; j <= 3; j++) {
//
//                }
//            }
            turn = algorithm.create(trip, 0, day, 2, turn,visit);//관광지추가
            if (trip.getPeriodInDays() > 1) {//당일치기 아니면 숙소추가
                algorithm.create(trip, 2, day, 1, turn,visit);
            }
            if (trip.getPeriodInDays() == 1) {//당일치기면 공항
                algorithm.create(trip, 5, day, 1, turn,visit);//공항
            }
        } else if (day == trip.getPeriodInDays() - 1) {//마지막날

            int endTime = trip.getEndTime().toSecondOfDay() / 60;
            if (endTime <= 720) {
                //12시 이전
            }

            turn = algorithm.create(trip, 0, day, 2, turn,visit);//관광지 추가
            algorithm.create(trip, 5, day, 1, turn,visit);//공항

        } else {
            turn = algorithm.create(trip, 0, day, 6, turn,visit);//관광지 추가
            algorithm.create(trip, 2, day, 1, turn,visit);//숙소
        }


    }



    @Override
    public List<ScheduleDTO> showTripSceduleList(Long tripId, int day) {
        List<Schedule> schedules = scheduleRepository.findByTripTripIdAndDayOrderByTurn(tripId,day);
        List<ScheduleDTO> scheduleList = new ArrayList<>();
        for (Schedule schedule : schedules) {

            scheduleList.add(ScheduleDTO.builder().placeName(schedule.getPlaceName()).ScheduleId(schedule.getScheduleId()).placeUid(schedule.getPlaceUid())
                            .stayTime(schedule.getStayTime()).lat(schedule.getLat()).lng(schedule.getLng()).build());
        }
        return scheduleList;
    }

    @Override
    @Transactional
    //placeuid
    //placeuid=0 더미
    public void createSchedule(Long tripId, Schedule schedule) {
        schedule.setTrip(tripRepository.findOneByTripId(tripId));
        scheduleRepository.save(schedule);
    }

    @Override
    @Transactional
    //이거 스케쥴 아이디로 조회할지 아니면 어떻게 할지 고민을 좀 해봐야된다
    public void updateSchedule(Long ScheduleId, Schedule schedule) {
        //dto에 scheduleId 추가한다.
        Schedule originSchedule = scheduleRepository.findOneByScheduleId(ScheduleId);
        originSchedule.setPlaceName(schedule.getPlaceName());
        scheduleRepository.save(originSchedule);

    }

    @Override
    public void deleteSchedule(Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }
}
