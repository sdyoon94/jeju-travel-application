package a609.backend.service;

import a609.backend.db.entity.Trip;
import a609.backend.db.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TripServiceImpl implements TripService{

    @Autowired
    TripRepository tripRepository;

    @Override
    public Trip showTripInfo(int tripId) {
        return tripRepository.findOneByTripId(tripId);
    }

    @Override
    public void registerTrip(Trip trip) {
        tripRepository.save(trip);
    }

    @Override
    public void updateTrip(int tripId,Trip trip) {
        Trip originTrip = tripRepository.findOneByTripId(tripId);
        if(trip.getTripName() != null){
            originTrip.setTripName(trip.getTripName());
        }
        if(trip.getTripMember() != null){
            originTrip.setTripMember(trip.getTripMember());
        }
        if(trip.getBudget() != null){
            originTrip.setBudget(trip.getBudget());
        }
        if(trip.getEndDate() != null){
            originTrip.setEndDate(trip.getEndDate());
        }
        if(trip.getStartDate() != null){
            originTrip.setStartDate(trip.getStartDate());
        }
        if(trip.getStyle() != null){
            originTrip.setStyle(trip.getStyle());
        }
        tripRepository.save(originTrip);
    }

    @Override
    public void deleteTrip(int tripId) {
        tripRepository.deleteTripByTripId(tripId);
    }
}
