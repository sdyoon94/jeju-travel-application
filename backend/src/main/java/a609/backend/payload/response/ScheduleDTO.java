package a609.backend.payload.response;

import a609.backend.db.entity.Place;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;

@Builder
@Getter
@Setter
public class ScheduleDTO {

    private Long placeUid;

    private String placeName;

    private Integer stayTime;

    private Double lat;

    private Double lng;

//    private String roadAddress;

//    private String imgPath;

    //태그 추가

}
