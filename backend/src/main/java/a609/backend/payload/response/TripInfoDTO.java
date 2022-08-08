package a609.backend.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TripInfoDTO {

    private String userUid;

    private List<FindTripDTO> tripList;



}
