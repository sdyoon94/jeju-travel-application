package a609.backend.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Getter
@Setter
@ToString
@Entity
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="SCHEDULE_ID")
    private Integer scheduleId;

    @Column(name="PLACE_ID")
    private Integer placeId;

    // 몇일차 인지
    @Column(name="DAY_ID")
    private Integer dayId;

    //여행 순서
    @Column(name="SCHEDULE_ORDER_")
    private Integer scheduleOrder;

    @Column(name="STAY_TIME")
    private Integer stayTime;

    @Column(name="IS_FIXED")
    private Boolean isFixed;

    //여행 스케줄불러올때 있는게 편하지 않을까..?
    @Column(name="TRIP_ID")
    private int tripId;


}
