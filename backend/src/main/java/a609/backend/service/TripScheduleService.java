package a609.backend.service;

import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.payload.response.ScheduleDTO;

import java.util.List;
import java.util.Map;

public interface TripScheduleService {
    void registerSchedule(Trip trip,int day,int[] visit,boolean reRecommend,double hungry,int turn,int restaurant,int tire);

    void updateSchedule(Long ScheduleId, Schedule schedule);

    List<ScheduleDTO> showTripSceduleList(Long tripId, int day);

    void createSchedule(Long tripId, Schedule schedule);

    void deleteSchedule(Long scheduleId);

    //재추천
    List<ScheduleDTO> recommendScheduleList(Map<String, Schedule[]> schedules, Long tripId);
}
