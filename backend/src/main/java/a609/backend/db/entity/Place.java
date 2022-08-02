package a609.backend.db.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="PLACE_UID")
    private int placeUid;

    @Column(name="PLACE_NAME")
    private String name;

    @Column(name="PLACE_TYPE")
    private int type;

    @OneToMany(mappedBy = "place")
    List<PlaceTag> tag = new ArrayList<>();

    @Column(name="READ_ADDRESS")
    private int address;

    @Column(name="LAT")
    private double lat;

    @Column(name="LNG")
    private double lng;

}
