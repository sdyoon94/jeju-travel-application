package a609.backend.controller;

import a609.backend.db.entity.Trip;
import a609.backend.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/trips")
public class TripContoroller {

    @Autowired
    TripService tripService;

    @PostMapping("/register")
    public ResponseEntity<String> registerTrip(@RequestBody Trip trip){
        Map<String, Object> resultMap = new HashMap<>();
        tripService.registerTrip(trip);

        return new ResponseEntity<String>("Success", HttpStatus.OK);
    }

    @GetMapping("/showTrip/{tripId}")
    public ResponseEntity<Map<String,Object>> showTripInfo(@PathVariable int tripId){
        Map<String, Object> resultMap = new HashMap<>();
        Trip tripInfo = tripService.showTripInfo(tripId);
        resultMap.put("tripInfo", tripInfo);
        resultMap.put("message", "Success");
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    @PutMapping("/update/{tripId}")
    public ResponseEntity<Map<String,Object>> updateTrip(@PathVariable int tripId,@RequestBody Trip trip){
        Map<String, Object> resultMap = new HashMap<>();
        tripService.updateTrip(tripId,trip);
        resultMap.put("message", "Success");
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    //여행 전체 삭제
    @DeleteMapping("/trip/{tripId}")
    public ResponseEntity<Map<String,Object>> deleteTrip(@PathVariable int tripId){
        Map<String, Object> resultMap = new HashMap<>();
        tripService.deleteTrip(tripId);

        resultMap.put("message", "Success");
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    //개인의 여행 나가기
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Map<String,Object>> deleteUserTrip(@PathVariable int userId){
        Map<String, Object> resultMap = new HashMap<>();
        tripService.deleteUserTrip(userId);

        resultMap.put("message", "Success");
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }



}
