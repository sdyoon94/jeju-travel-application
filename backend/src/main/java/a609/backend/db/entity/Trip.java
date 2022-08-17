package a609.backend.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="TRIP_ID")
    private Long tripId;

    @Column(name="TRIP_NAME")
    private String tripName;

    @Column(name="START_DATE")
    private LocalDate startDate;
//    LocalDate startDate = LocalDate.of(year, month, dayofmonth);

    @Column(name="PERIOD")
    private Integer periodInDays;

    @Column(name="BUDGET")
    private Integer budget;

    @Column(name="START_TIME")
    private LocalTime startTime;
    // LocalTime starttime = LocalTime.of( ~~~);
    @Column(name="END_TIME")
    private LocalTime endTime;

    @Column(name="VEHICLE")
    private String vehicle;

    @OneToMany(mappedBy="trip", cascade=CascadeType.ALL,fetch=FetchType.LAZY)
    List<UserTrip> tripMember = new ArrayList<>();

    @Column(name="STYLE")
    private Integer style;

    @Column(name="CREATOR_ID")
    private Long creatorId;

    @OneToMany(mappedBy="trip", cascade = CascadeType.ALL)
    List<Schedule> schedules = new ArrayList<>();

    @Column(name="MAX_MEMBER")
    private Integer maxMemberCnt;



}
