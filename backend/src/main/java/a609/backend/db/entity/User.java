package a609.backend.db.entity;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;


@Getter
@Setter
@ToString
@Entity
public class User {

    @Id
    String id;
    String password;
    String nickname;
    int authority;
    String authkey;


}
