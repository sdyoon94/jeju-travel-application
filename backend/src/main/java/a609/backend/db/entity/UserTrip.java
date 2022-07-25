package a609.backend.db.entity;

import javax.persistence.*;

@Entity
public class UserTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="USER_TRIP_ID")
    private int userTripID;

    private int style;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRIP_ID")
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    private User user;
}