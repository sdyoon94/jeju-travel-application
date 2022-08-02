package a609.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/schedule")
public class TripScheduleController {



    //소켓을 거치고 오니까.. 어떤 타입으로 오는지? 소켓으로 통신하고 최종본만 여기 저장되는지
    @PutMapping
    public ResponseEntity<Map<String,String>> updatePlace(){
        return null;
    }

}
