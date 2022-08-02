package a609.backend.db.entity;

import javax.persistence.*;

@Entity
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="TAG_ID")
    private int tagId;

    private String tagName;

    private Double style1;
    private Double style2;
    private Double style3;
    private Double style4;
    private Double style5;
    private Double style6;
    private Double style7;

}
