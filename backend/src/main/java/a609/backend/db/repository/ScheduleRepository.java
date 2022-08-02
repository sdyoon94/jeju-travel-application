package a609.backend.db.repository;

import a609.backend.db.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule,String> {

    Schedule save(Schedule schedule);

}
