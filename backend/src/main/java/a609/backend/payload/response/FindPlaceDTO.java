package a609.backend.payload.response;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.PlaceTag;
import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class FindPlaceDTO {
    private Long placeUid;
    private String placeName;
    private List<String> tag;
    private String imgPath;
    private double lat;
    private double lng;

    public FindPlaceDTO() {
    }

    public FindPlaceDTO(Long placeUid, String placeName, List<String> tag, String imgPath) {
        this.placeUid = placeUid;
        this.placeName = placeName;
        this.tag = tag;
        this.imgPath = imgPath;
    }

    public FindPlaceDTO(Place o) {
        this.placeUid=o.getPlaceUid();
        this.placeName=o.getPlaceName();
        this.tag = Arrays.stream(o.getTag().replaceAll(" ", "").split(",")).collect(Collectors.toList());
        this.imgPath=o.getImgPath();
        this.lat=o.getLat();
        this.lng=o.getLng();
    }
}
