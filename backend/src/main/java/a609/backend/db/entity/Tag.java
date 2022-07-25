package a609.backend.db.entity;

import javax.persistence.*;

@Entity
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="TAG_ID")
    private int tagId;

    private String tagName;

    private double style1;
    private double style2;
    private double style3;
    private double style4;
    private double style5;
    private double style6;
    private double style7;

}
