package a609.backend.db.repository;

import a609.backend.db.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;


@Repository
public interface ScheduleRepository extends JpaRepository<Schedule,Long> {

    Schedule save(Schedule schedule);

    Schedule findOneByScheduleId(Long scheduleId);

    void deleteById(Long ScheduleId);

    // 각 여행의 일자별로 여행을 뽑아옴;
    List<Schedule> findByTripTripIdAndDayOrderByTurn(Long tripId, Integer day);

    // 여행일정을 id로 검색 후 day,턴으로 소팅해서 가져옴
    List<Schedule> findByTripTripIdOrderByDayAscTurnAsc(Long tripId);
    // 여행 일자별로 고정된거 빼고 날리기
    void deleteByTripTripIdAndDayAndIsFixedFalse(Long tripId, Integer day);

    Schedule findByTripTripIdAndDayAndTurn(Long tripId,int day,int turn);
    Long countByTripTripIdAndDay(Long tripId,int day);

    void deleteByTripTripIdAndDayAndTurn(Long tripId,int day,int turn);

    void deleteByTripTripIdAndDay(Long tripId,int day);
}
