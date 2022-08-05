package a609.backend.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class FindTripDTO {

    private Long tripId;

    private String tripName;

    private LocalDate startDate;

    private Integer period;


}
