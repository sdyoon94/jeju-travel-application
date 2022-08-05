package a609.backend.payload.response;

import a609.backend.db.entity.Place;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleDTO {

    private Long placeUid;

    private String placeName;

    private Integer stayTime;


}
