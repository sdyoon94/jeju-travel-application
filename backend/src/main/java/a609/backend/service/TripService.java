package a609.backend.service;

import a609.backend.db.entity.Trip;
import a609.backend.db.entity.User;
import a609.backend.payload.response.FindTripDTO;

import java.util.List;

public interface TripService {

    FindTripDTO showTripInfo(Long tripId);
    List<FindTripDTO> showTripList(String token);

    String registerTrip(Trip trip,String token);
    void updateTrip(Long tripId,Trip trip);
    void deleteTrip(Long tripId);
    void addUser(Long tripId, String userId);
    void deleteUserTrip(Integer tripId, String token);

}
