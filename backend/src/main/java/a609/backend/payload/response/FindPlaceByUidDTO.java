package a609.backend.payload.response;

import a609.backend.db.entity.Place;
import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class FindPlaceByUidDTO {

    private String placeName;
    private List<String> tag;
    private String imgPath;
    private String roadAddress;

    public FindPlaceByUidDTO(Place place) {
        this.placeName = place.getPlaceName();
        this.tag = Arrays.stream(
                place.getTag().replaceAll(" ","").split(","))
                .collect(Collectors.toList());
        this.imgPath = place.getImgPath();
        this.roadAddress = place.getRoadAddress();
    }
}
