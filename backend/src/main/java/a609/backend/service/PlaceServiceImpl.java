package a609.backend.service;

import a609.backend.db.entity.Place;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.payload.response.FindPlaceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
            List<String> tags = Arrays.stream(place.getTag().split(",")).collect(Collectors.toList());
            if(tags.get(0).equals("")){
                tags= new ArrayList<>();
            }
            dto.setTag(tags);
            placeDTOs.add(dto);
        }
        return placeDTOs;
    }
}
