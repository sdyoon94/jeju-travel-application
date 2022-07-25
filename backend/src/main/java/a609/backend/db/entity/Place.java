package a609.backend.db.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="PLACE_ID")
    private int placeId;

    @Column(name="PLACE_NAME")
    private String placeName;

    @Column(name="PLACE_TYPE")
    private int placeType;

    @OneToMany(mappedBy = "place")
    List<PlaceTag> tags = new ArrayList<>();
}
