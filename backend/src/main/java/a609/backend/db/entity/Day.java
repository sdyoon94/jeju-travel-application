package a609.backend.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@ToString
@Entity
public class Day {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="DAY_ID")
    private int dayId;

    private Integer tripId;
    //몇일차인지
    @Column(name="DAY")
    private Integer day;
    //첫날
    @Column(name="START_TIME")
    private Date startTime;
    //마지막날
    @Column(name="END_TIME")
    private Date endtTime;


}
