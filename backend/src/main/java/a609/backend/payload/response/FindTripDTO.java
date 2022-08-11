package a609.backend.payload.response;

import a609.backend.db.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class FindTripDTO {

    private Long tripId;

    private String tripName;

    private LocalDate startDate;

    private Integer periodInDays;

    private Integer budget;

    private String vehicle;

    private Integer style;
    //멤버
    private List<UserDTO> member;





}
