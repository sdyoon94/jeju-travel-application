package a609.backend.service;

import a609.backend.db.entity.Trip;
import a609.backend.db.entity.User;

public interface TripService {

    Trip showTripInfo(int tripId);

    void registerTrip(Trip trip);
    void updateTrip(int tripId,Trip trip);
    void deleteTrip(int tripId);
}
