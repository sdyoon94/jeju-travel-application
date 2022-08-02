package a609.backend.service;

import a609.backend.db.entity.Trip;
import a609.backend.db.entity.User;

import java.util.List;

public interface TripService {

    Trip showTripInfo(int tripId);
//    List<Trip> showTripList(int userId);

    void registerTrip(Trip trip,String userId);
    void updateTrip(int tripId,Trip trip);
    void deleteTrip(int tripId);

    void deleteUserTrip(int userId);

}
