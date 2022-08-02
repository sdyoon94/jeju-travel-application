package a609.backend.db.repository;

import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule,String> {

    Schedule save(Schedule schedule);

    //목록 불러오기
    List<Schedule> findAllByTripId(int tripId);

}
