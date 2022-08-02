package a609.backend.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="TRIP_ID")
    private int tripId;

    @Column(name="TRIP_NAME")
    private String tripName;

    private int period;

    @Temporal(TemporalType.DATE)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    private Date endTime;

    @Temporal(TemporalType.DATE)
    private Date startTime;

    @OneToMany(mappedBy="trip")
    List<UserTrip> tripMember = new ArrayList<>();

    @Column(name="BUDGET")
    private Integer budget;

    @Column(name="STYLE")
    private Integer style;


    //이동수단 기본 자동차
    //유저마다 가능한 날짜 선택된 리스트

}
