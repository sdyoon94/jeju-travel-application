package a609.backend.controller;

import a609.backend.db.entity.Place;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.payload.response.FindPlaceDTO;
import a609.backend.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/place")
public class PlaceController {

    @Autowired
    PlaceService placeService;

    @GetMapping("/find/{keyword}")
    public ResponseEntity<?> findPlace(@PathVariable String keyword){
        Map<String, Object> resultMap = new HashMap<>();
        List<FindPlaceDTO> findPlaces = placeService.findPlace(keyword);
        resultMap.put("findPlaces", findPlaces);
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
