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
}
