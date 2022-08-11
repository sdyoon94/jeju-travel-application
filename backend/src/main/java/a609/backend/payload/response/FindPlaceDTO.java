package a609.backend.payload.response;

import a609.backend.db.entity.PlaceTag;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FindPlaceDTO {
    private Long placeUid;
    private String placeName;
    private List<String> tag;
    private String imgPath;

}
