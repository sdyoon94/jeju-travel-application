package a609.backend.service;

import a609.backend.db.entity.Trip;

public interface TripScheduleService {
    void registerSchedule(Trip trip);

    void updateSchedule();
}
