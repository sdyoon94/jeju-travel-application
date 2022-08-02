package a609.backend.service;

import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;

import java.util.List;

public interface TripScheduleService {
    void registerSchedule(Trip trip);

    void updateSchedule();

    List<Schedule> showTripSceduleList(int tripId);
}
