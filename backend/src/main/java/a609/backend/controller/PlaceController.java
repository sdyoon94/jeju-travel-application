package a609.backend.controller;

import a609.backend.db.entity.Place;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.payload.response.FindPlaceDTO;
import a609.backend.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/place")
public class PlaceController {

    @Autowired
    PlaceService placeService;

    @GetMapping("/find")
    public ResponseEntity<?> findPlace(@RequestParam("q") String keyword){
        Map<String, Object> resultMap = new HashMap<>();
        List<FindPlaceDTO> findPlaces = placeService.findPlace(keyword);
        resultMap.put("findPlaces", findPlaces);
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/recommend/{tripId}/{day}")
    public ResponseEntity<?> findPlace(@PathVariable("tripId") Long tripId, @PathVariable("day") int day){
        Map<String, Object> resultMap = new HashMap<>();
        try{
            List<FindPlaceDTO> recommendPlaces = placeService.recommendPlace(tripId, day);
            resultMap.put("recommendPlaces", recommendPlaces);
            return new ResponseEntity<>(resultMap, HttpStatus.OK);

        }catch(Exception e){
            e.printStackTrace();
            resultMap.put("message", "추천에서 에러났다아아아아");
            return new ResponseEntity<>(resultMap, HttpStatus.BAD_REQUEST);
        }
    }
}
