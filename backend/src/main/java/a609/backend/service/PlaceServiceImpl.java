package a609.backend.service;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.ScheduleRepository;
import a609.backend.db.repository.TripRepository;
import a609.backend.payload.response.FindPlaceByUidDTO;
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

    @Autowired
    TripRepository tripRepository;

    @Override
    public List<FindPlaceDTO> findPlace(String keyword) {
        List<Place> places = placeRepository.findByPlaceNameContains(keyword);
        List<FindPlaceDTO> placeDTOs = places.stream().map(place -> new FindPlaceDTO(place)).collect(Collectors.toList());

        return placeDTOs;
    }

    @Override
    public List<FindPlaceDTO> recommendPlace(Long tripId, int day) {

        HashSet<Place> beforeRecommend = new HashSet<>();
        List<Place> tempList = new ArrayList<>();
        int style = tripRepository.findOneByTripId(tripId).getStyle();
        List<Schedule> scheduleNow = scheduleRepository.findByTripTripIdAndDayOrderByTurn(tripId, day);
        List<Integer> tripStyles = new ArrayList<>();
        tripStyles.add(9);
        for(int i=0;i<7;i++){
            if((style&(1<<i))==(1<<i)){
                tripStyles.add(i);
            }
        }
        for (Schedule schedule : scheduleNow) {
            List<Place> tourByDistance = placeRepository.findRecommendByDistance(schedule.getLat(), schedule.getLng(), 5D, tripStyles);
            for (Place place : tourByDistance) {
                beforeRecommend.add(place);
            }
        }

        for (Place place : beforeRecommend) {
            if(place.getThumbs()==null) System.out.println(place.getPlaceName());
            tempList.add(place);
        }

        Collections.sort(tempList, (o1, o2) -> o1.getThumbs() - o2.getThumbs());
        return tempList.stream().map(o -> new FindPlaceDTO(o)).collect(Collectors.toList()).subList(0,Math.min(tempList.size(),7));
    }

    @Override
    public FindPlaceByUidDTO findPlaceByUid(Long placeUid) {
        Place findPlace = placeRepository.findOneByPlaceUid(placeUid);
        return new FindPlaceByUidDTO(findPlace);

    }
}
