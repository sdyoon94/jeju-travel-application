package a609.backend.db.repository;

import a609.backend.db.entity.Day;
import a609.backend.db.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

public interface DayRepository extends JpaRepository<Day, String> {

    Day save(Day day);

    @Transactional
    void deleteDaysByTripId(Trip tripId); //여행 삭제되면 같이 삭제

    @Transactional
    void deleteDaysByDayId(Day dayId); //일자별 삭제 -여행 기간 변화하면
}
