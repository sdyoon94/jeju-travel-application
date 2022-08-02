package a609.backend.db.repository;

import a609.backend.db.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    Trip save(Trip trip);

    Trip findOneByTripId(int tripId);

    @Transactional
    void deleteTripByTripId(int tripId);


}
