package a609.backend.service;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.ScheduleRepository;
import a609.backend.db.repository.TripRepository;
import a609.backend.payload.response.FindPlaceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlaceServiceImpl implements PlaceService{

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    ScheduleRepository scheduleRepository;

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

    @Override
    public List<FindPlaceDTO> recommendPlace(Long tripId, int day) {
        //피로도 고려하는건 추후에 수정합시다.
        HashSet<Place> beforeRecommend = new HashSet<>();
        List<Place> tempList = new ArrayList<>();
        List<Schedule> scheduleNow = scheduleRepository.findByTripTripIdAndDayOrderByTurn(tripId, day);
        for (Schedule schedule : scheduleNow) {
            List<Place> tourByDistance = placeRepository.findTourByDistance(schedule.getLat(), schedule.getLng(), 5D, 0);
            for (Place place : tourByDistance) {
                beforeRecommend.add(place);
            }
        }
        for (Place place : beforeRecommend) {
            tempList.add(place);
        }
        Collections.sort(tempList, (o1, o2) -> o1.getThumbs() - o2.getThumbs());
        return tempList.stream().map(o -> new FindPlaceDTO(o)).collect(Collectors.toList()).subList(0,Math.min(tempList.size(),7));
    }
}
