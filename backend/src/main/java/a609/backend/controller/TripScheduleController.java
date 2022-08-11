package a609.backend.controller;

import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.service.TripScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sun.reflect.annotation.ExceptionProxy;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/schedule")
public class TripScheduleController {

    @Autowired
    TripScheduleService tripScheduleService;

    //여행방을 누르면 보여줄 일정
    @GetMapping
    public ResponseEntity<Map<String,Object>> showTripScheduleList(@RequestParam("tripId") Long tripId,@RequestParam("day") int day){
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("일자별 Schedule List",tripScheduleService.showTripSceduleList(tripId,day));
        return new ResponseEntity<Map<String,Object>>(resultMap, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createSchedule(Long tripId, Schedule schedule){
        Map<String, Object> resultMap = new HashMap<>();
        try{
            tripScheduleService.createSchedule(tripId, schedule);
            resultMap.put("message", "success");
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("message", "스케쥴 생성 에러났다아아");
            return new ResponseEntity<>(resultMap, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateSchedule(Long scheduleId, Schedule schedule){
        Map<String, Object> resultMap = new HashMap<>();
        try{
            tripScheduleService.updateSchedule(scheduleId, schedule);
            resultMap.put("message", "success");
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("message", "스케쥴 수정 에러났다아아");
            return new ResponseEntity<>(resultMap, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteSchedule(Long scheduleId){
        Map<String, Object> resultMap = new HashMap<>();
        try{
            tripScheduleService.deleteSchedule(scheduleId);
            resultMap.put("message", "success");
            return new ResponseEntity<>(resultMap, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("message", "삭제 에러났다아아");
            return new ResponseEntity<>(resultMap, HttpStatus.BAD_REQUEST);
        }
    }


}
