package a609.backend.db.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="TRIP_ID")
    private int tripId;

    private String tripName;

    @Temporal(TemporalType.DATE)
    private Date startDate;
    @Temporal(TemporalType.DATE)
    private Date endDate;

    @OneToMany(mappedBy="trip")
    List<UserTrip> tripMember = new ArrayList<>();

    private int budget;
    //private int? style;

}
