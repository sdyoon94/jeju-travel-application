package a609.backend.db.repository;

import a609.backend.db.entity.Trip;
import a609.backend.db.entity.User;
import a609.backend.db.entity.UserTrip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserTripRepository extends JpaRepository<UserTrip, Long> {

    UserTrip save(UserTrip userTrip);

    List<UserTrip> findByUserKakaoId(String kakaoId);

    List<UserTrip> findByTripTripId(Long tripId);


    void deleteByTripTripIdAndUserKakaoId(Long tripId, String KakaoId);
    void deleteByTripTripId(Long tripId);
    void deleteByUserKakaoId(String kakaoId);


}
