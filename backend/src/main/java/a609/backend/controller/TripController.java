package a609.backend.controller;

import a609.backend.db.entity.Trip;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.TripRepository;
import a609.backend.payload.response.FindTripDTO;
import a609.backend.payload.response.TripInfoDTO;
import a609.backend.service.TripService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/trip")
public class TripController {

    @Autowired
    TripService tripService;

//    토큰 없을때 test용 코드
//    @PostMapping("/{id}")
//    public ResponseEntity<Map<String, Object>> registerTrip(@RequestBody Trip trip,@PathVariable String id){
//        Map<String, Object> resultMap = new HashMap<>();
//        String tripId = tripService.registerTrip(trip,id);
//        resultMap.put("tripId",tripId);
//        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
//    }

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
        FindTripDTO tripInfo = tripService.showTripInfo(tripId);
        resultMap.put("tripInfo", tripInfo);
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
    @DeleteMapping("/{tripId}")
    public ResponseEntity<Map<String,Object>> deleteTrip(@PathVariable Long tripId){
        Map<String, Object> resultMap = new HashMap<>();
        tripService.deleteTrip(tripId);

        resultMap.put("message", "Success");
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    //개인의 여행 나가기
    @DeleteMapping("/user/{tripId}")
    public ResponseEntity<Map<String,Object>> deleteUserTrip(@PathVariable Long tripId, @RequestHeader Map<String,Object> token){
        Map<String, Object> resultMap = new HashMap<>();
        String jwt = (String) token.get("authorization");
        tripService.deleteUserTrip(tripId, jwt);
        resultMap.put("message", "Success");
        return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.OK);
    }

    @GetMapping("/showTripList")
    public ResponseEntity<TripInfoDTO> showTripList(@RequestHeader Map<String,Object> token){

        Map<String, Object> resultMap = new HashMap<>();
//        TripInfoDTO tripInfoDTO = tripService.showTripList((String) token.get("authorization"));
//        resultMap.put("tripList",tripInfoDTO);

        return new ResponseEntity<TripInfoDTO>(tripService.showTripList((String) token.get("authorization")), HttpStatus.OK);
    }

    @PutMapping("/addUser/{tripId}")
    public ResponseEntity<Map<String,Object>> addMember(@PathVariable Long tripId,@RequestHeader Map<String,Object> token){
        Map<String, Object> resultMap = new HashMap<>();
        int addresult = tripService.addUser(tripId,(String) token.get("authorization"));
        if(addresult==1){
            resultMap.put("message", "Success");
        }else if(addresult==2){
            resultMap.put("message", "이미 참여한 여행입니다");
        }else if(addresult==3){
            resultMap.put("message", "인원제한을 초과했습니다");
        }else{
            resultMap.put("message", "인원추가에서 정체불명의 에러가 발생했다아아아아");
            return new ResponseEntity<Map<String,Object>>(resultMap, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<Map<String,Object>>(resultMap, HttpStatus.OK);
    }

//        @GetMapping("/test")
//    public ResponseEntity<?> test(){
//        List<FindTripDTO> tripList = new ArrayList<>();
//        List<Trip> trip = tripRepository.findAllByBudgetAndPeriodInDays(5000,1);
//        for (Trip userTrip : trip) {
//
//            FindTripDTO findTripDTO = new FindTripDTO();
//            findTripDTO.setTripId(userTrip.getTripId());
//            findTripDTO.setTripName(userTrip.getTripName());
//            findTripDTO.setPeriodInDays(userTrip.getPeriodInDays());
//            findTripDTO.setStartDate(userTrip.getStartDate());
//            findTripDTO.setBudget(userTrip.getBudget());
//            tripList.add(findTripDTO);
//        }
//        return new ResponseEntity<List<FindTripDTO>>(tripList,HttpStatus.OK);
//    }


}
