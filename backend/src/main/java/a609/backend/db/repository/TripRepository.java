package a609.backend.db.repository;

import a609.backend.db.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    Trip save(Trip trip);

    Trip findOneByTripId(Long tripId);

    @Transactional
    void deleteTripByTripId(Long tripId);

//    //목록 불러오기
//    List<Trip> findAllByUserId(int userId);


}
