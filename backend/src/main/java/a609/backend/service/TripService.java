package a609.backend.service;

import a609.backend.db.entity.Trip;
import a609.backend.payload.response.FindTripDTO;
import a609.backend.payload.response.TripInfoDTO;

public interface TripService {

    FindTripDTO showTripInfo(Long tripId, String token);

    TripInfoDTO showTripList(String token);

    String registerTrip(Trip trip,String token);
    void updateTrip(Long tripId,Trip trip);
    void deleteTrip(Long tripId);
    int addUser(Long tripId, String token);
    void deleteUserTrip(Long tripId, String token);

}
