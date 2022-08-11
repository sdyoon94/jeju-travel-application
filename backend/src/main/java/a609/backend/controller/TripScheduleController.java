package a609.backend.controller;

import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.service.TripScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/schedule")
public class TripScheduleController {

    @Autowired
    TripScheduleService tripScheduleService;

    //스케줄이랑 트립 한꺼번에 옴,, 바디 자료형 바꺼야 될듯..?
    @PutMapping
    public ResponseEntity<Map<String,Object>> updateScedule(@RequestBody Trip trip){
        Map<String, Object> resultMap = new HashMap<>();


        return new ResponseEntity<Map<String,Object>>(resultMap, HttpStatus.OK);
    }

    //여행방을 누르면 보여줄 일정
    @GetMapping
    public ResponseEntity<Map<String,Object>> showTripScheduleList(@RequestParam("tripId") Long tripId,@RequestParam("day") int day){
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("일자별 Schedule List",tripScheduleService.showTripSceduleList(tripId,day));
        return new ResponseEntity<Map<String,Object>>(resultMap, HttpStatus.OK);

    }

}
