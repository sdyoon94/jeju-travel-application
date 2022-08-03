package a609.backend.controller;

import a609.backend.db.entity.Schedule;
import a609.backend.service.TripScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/schedule")
public class TripScheduleController {

    @Autowired
    TripScheduleService tripScheduleService;

    //소켓을 거치고 오니까.. 어떤 타입으로 오는지? 소켓으로 통신하고 최종본만 여기 저장되는지
    @PutMapping
    public ResponseEntity<Map<String,String>> updatePlace(){
        return null;
    }

    //여행방을 누르면 보여줄 일정
    @GetMapping("/{tripId}")
    public ResponseEntity<?> showTripScheduleList(@PathVariable int tripId){

        return new ResponseEntity<List<Schedule>>(tripScheduleService.showTripSceduleList(tripId), HttpStatus.OK);

    }

}
