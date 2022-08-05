package a609.backend.service;

import a609.backend.db.entity.Trip;
import a609.backend.db.entity.User;

import java.util.List;

public interface TripService {

    Trip showTripInfo(Long tripId);
//    List<Trip> showTripList(int userId);

    void registerTrip(Trip trip,String userId);
    void updateTrip(Long tripId,Trip trip);
    void deleteTrip(Long tripId);
    void addUser(Long tripId, String userId);
    void deleteUserTrip(int userId);

}
