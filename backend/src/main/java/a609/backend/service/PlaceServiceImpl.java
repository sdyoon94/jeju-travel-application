package a609.backend.service;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.PlaceTag;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.payload.response.FindPlaceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlaceServiceImpl implements PlaceService{

    @Autowired
    PlaceRepository placeRepository;

    @Override
    public List<FindPlaceDTO> findPlace(String keyword) {
        List<Place> places = placeRepository.findByPlaceNameContains(keyword);
        List<FindPlaceDTO> placeDTOs = new ArrayList<>();
        for(Place place: places){
            FindPlaceDTO dto = new FindPlaceDTO();
            dto.setPlaceName(place.getPlaceName());
            dto.setPlaceUid(place.getPlaceUid());
            dto.setImgPath(place.getImgPath());
            List<String> tags = new ArrayList<>();
            List<PlaceTag> placeTag = place.getPlaceTag();
            for (PlaceTag tag : placeTag) {
                tags.add(tag.getTagName());
            }
            dto.setTag(tags);
            placeDTOs.add(dto);
        }
        return placeDTOs;
    }
}
