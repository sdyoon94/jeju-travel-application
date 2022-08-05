package a609.backend.controller;

import a609.backend.db.entity.Trip;
import a609.backend.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/trips")
public class TripController {

    @Autowired
    TripService tripService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> registerTrip(@RequestBody Trip trip,@RequestHeader Map<String,Object> token){
        Map<String, Object> resultMap = new HashMap<>();
        String tripId = tripService.registerTrip(trip,(String) token.get("authorization"));
        resultMap.put("tripId",tripId);
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/showTripInfo/{tripId}")
    public ResponseEntity<Map<String,Object>> showTripInfo(@PathVariable Long tripId){
        Map<String, Object> resultMap = new HashMap<>();
        Trip tripInfo = tripService.showTripInfo(tripId);
        resultMap.put("tripInfo", tripInfo);
        resultMap.put("message", "Success");
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    @PutMapping("/update/{tripId}")
    public ResponseEntity<Map<String,Object>> updateTrip(@PathVariable Long tripId,@RequestBody Trip trip){
        Map<String, Object> resultMap = new HashMap<>();
        tripService.updateTrip(tripId,trip);
        resultMap.put("message", "Success");
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    //여행 전체 삭제
    @DeleteMapping("/trip/{tripId}")
    public ResponseEntity<Map<String,Object>> deleteTrip(@PathVariable Long tripId){
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

    @GetMapping("/showTripList/{userId}")
    public ResponseEntity<Map<String,Object>> showTripList(@PathVariable int userId){
        Map<String, Object> resultMap = new HashMap<>();


        return new ResponseEntity<Map<String,Object>>(resultMap, HttpStatus.OK);
    }



}
