package a609.backend.service;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Trip;
import a609.backend.db.entity.Schedule;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.ScheduleRepository;
import a609.backend.db.repository.TripRepository;
import a609.backend.payload.response.ScheduleDTO;
import a609.backend.util.Algorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class TripScheduleServiceImpl implements TripScheduleService{

    @Autowired
    Algorithm algorithm;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    TripRepository tripRepository;



    @Override
    public void registerSchedule(Trip trip,int day,int[] visit,boolean reRecommend,double hungry,int turn,int restaurant,int tire) {
            //test

        int placeType=0;

        if (day == 0) {//첫째날

            turn = algorithm.create(trip, 5, day, 1, turn,visit,hungry,tire,restaurant).getTurn();//공항

            double startTime = trip.getStartTime().toSecondOfDay() / 60/60;

            hungry=startTime;

            while(hungry<20.0) {//8시 이전이면
                placeType=0;
                if (hungry>=11.5&& hungry<13.5&&restaurant<1){
                    placeType=3;
                }
                if (hungry>=17.5&&hungry<19.5&&restaurant<2){
                    placeType=3;
                }
                Algorithm.Check ch = algorithm.create(trip, placeType, day, 1, turn, visit, hungry,tire,restaurant);//관광지 추가
                hungry= ch.getHungry();
                turn=ch.getTurn();
                restaurant=ch.getRestaurant();

            }

//            turn = algorithm.create(trip, 0, day, 2, turn,visit,hungry,tire,restaurant,cafe);//관광지추가
            if (trip.getPeriodInDays() > 1) {//당일치기 아니면 숙소추가
                algorithm.create(trip, 2, day, 1, turn,visit,hungry,tire,restaurant);
            }
            if (trip.getPeriodInDays() == 1) {//당일치기면 공항
                algorithm.create(trip, 5, day, 1, turn,visit,hungry,tire,restaurant);//공항
            }
        } else if (day == trip.getPeriodInDays() - 1) {//마지막날
            hungry=9;
            int endTime = trip.getEndTime().toSecondOfDay() / 60/60;
            while(hungry<endTime-2) {//8시 이전이면
                placeType=0;
                if (hungry>=11.5&& hungry<13.5&&restaurant<1){
                    placeType=3;
                }
                if (hungry>=17.5&&hungry<19.5&&restaurant<2){
                    placeType=3;
                }
                Algorithm.Check ch = algorithm.create(trip, placeType, day, 1, turn, visit, hungry,tire,restaurant);//관광지 추가
                hungry= ch.getHungry();
                turn=ch.getTurn();
                restaurant=ch.getRestaurant();

            }

//            turn = algorithm.create(trip, 0, day, 2, turn,visit,hungry,tire,restaurant,cafe);//관광지 추가
            algorithm.create(trip, 5, day, 1, turn,visit,hungry,tire,restaurant);//공항

        } else {

            hungry=9.0;
            while(hungry<20.0) {//8시 이전이면
                log.info("Hungry -------------------"+hungry);
                placeType=0;
                if(tire>=4){ //피로도 4이상이면 카페가기
                    placeType=4;
                }
                if(hungry>=11.5&& hungry<14.0&&restaurant<1){//점심시간
                    placeType=3;
                }
                if (hungry>=17.5&&hungry<20.5&&restaurant<2){
                    placeType=3;
                }

                Algorithm.Check ch = algorithm.create(trip, placeType, day, 1, turn, visit, hungry,tire,restaurant);//관광지 추가
                hungry= ch.getHungry();
                turn=ch.getTurn();
                restaurant=ch.getRestaurant();

            }
            algorithm.create(trip, 2, day, 1, turn,visit,hungry,tire,restaurant);//숙소
        }
    }

    @Override
    public List<ScheduleDTO> showTripSceduleList(Long tripId, int day) {
        List<Schedule> schedules = scheduleRepository.findByTripTripIdAndDayOrderByTurn(tripId,day);
        List<ScheduleDTO> scheduleList = new ArrayList<>();
        for (Schedule schedule : schedules) {

            scheduleList.add(ScheduleDTO.builder().placeName(schedule.getPlaceName()).scheduleId(schedule.getScheduleId()).placeUid(schedule.getPlaceUid())
                            .stayTime(schedule.getStayTime()).lat(schedule.getLat()).lng(schedule.getLng()).build());
        }
        return scheduleList;
    }

    @Override
    @Transactional
    //placeuid
    //placeuid=0 더미
    public void createSchedule(Long tripId, Schedule schedule) {
        schedule.setTrip(tripRepository.findOneByTripId(tripId));
        scheduleRepository.save(schedule);
    }

    @Override
    @Transactional
    //이거 스케쥴 아이디로 조회할지 아니면 어떻게 할지 고민을 좀 해봐야된다
    public void updateSchedule(Long ScheduleId, Schedule schedule) {
        //dto에 scheduleId 추가한다.
        Schedule originSchedule = scheduleRepository.findOneByScheduleId(ScheduleId);
        originSchedule.setPlaceName(schedule.getPlaceName());
        scheduleRepository.save(originSchedule);

    }

    @Override
    public void deleteSchedule(Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }


    //재추천 숙소포함
    @Transactional
    @Override
    public List<ScheduleDTO> recommendScheduleList(Map<String, Schedule[]> schedules, Long tripId) {
        int visti[] =new int[4000];
        Schedule firstSchedule = scheduleRepository.findByTripTripIdAndDayAndTurn(tripId,0,0);//첫번째 공항스케줄
        Trip trip = firstSchedule.getTrip();


        for (int i=0; i<schedules.size();i++){//day별로

            int restaurant =0;
            int tire =0;
            double hungry =0.0;
            //원래 일정갯수로
            int originScheduleCnt = Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(tripId, i));


            Schedule[] scheduleList = schedules.get(String.valueOf(i));//day별 스케줄리스트
            if (scheduleList==null){//날짜가 비었으면
                this.registerSchedule(trip,i,visti,false,hungry,0,0,0);//처음부터 새로 생성해줘야
                continue;
            }
            scheduleRepository.deleteAllByTripTripIdAndDay(tripId,i);//날짜별로 삭제
            Schedule beforeSchdule;
            if(i==0) {
                beforeSchdule = firstSchedule;//공항


            }else{
                int turn = Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(tripId,i));
                beforeSchdule = scheduleRepository.findByTripTripIdAndDayAndTurn(tripId,i-1,turn);//전날숙소
            }
            scheduleRepository.save(beforeSchdule);

             int newTurn =1;
             int fixedScheduledCnt = scheduleList.length;
             int newAddScheduleCnt=originScheduleCnt-fixedScheduledCnt;

             for (Schedule fixedSchedule : scheduleList) {//재추천 순서는 고정된 일정부터 차례대로
                 if(newAddScheduleCnt==0){//더 추천해줄 갯수 초과하면 고정된 스케줄 다 넣기 ..근데 이거 거리 순소 고려 안됨..ㅜㅜ
                     fixedSchedule.setTrip(trip);
                     fixedSchedule.setDay(i);
                     fixedSchedule.setTurn(newTurn++);

                     hungry+=1.3;
                     tire+=placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid()).getTire()*fixedSchedule.getStayTime();
                     if(placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid()).getPlaceType()==3){
                         restaurant++;
                     }
                     continue;
                 }
//                Schedule fixedSchedule = scheduleRepository.findOneByScheduleId(schedule.getScheduleId());
                 if(fixedSchedule.getPlaceUid()==2) {//만약 숙소도 고정하고싶다면 생각 다시 해봐야..
                    //비포스케줄의 반경에서 다시 검색하고 숙소랑 가운데 일정 잡는 방식으로 추가해야됨.

                 }
                 fixedSchedule.setTrip(trip);
                 fixedSchedule.setDay(i);
                 fixedSchedule.setTurn(newTurn+1);
                 scheduleRepository.save(fixedSchedule);
                 tire+=placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid()).getTire()*fixedSchedule.getStayTime();
                 visti[Math.toIntExact(fixedSchedule.getPlaceUid())]=1;

                 if(placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid()).getPlaceType()==3){
                     restaurant++;
                 }

                 double lat = (beforeSchdule.getLat()+ fixedSchedule.getLat())/2;
                 double lng = (beforeSchdule.getLng()+ fixedSchedule.getLng())/2;
                 int placeType = 0;
                 if(hungry>=11.5&& hungry<14.0&&restaurant<1){//점심시간
                      placeType=3;
                 }
                 if (hungry>=17.5&&hungry<20.5&&restaurant<2){
                     placeType=3;
                 }
                //가운데 지점 중심으로 검색한 장소
                 Place place = algorithm.selectAroundPlace(lat,lng,placeType,fixedSchedule.getTrip().getStyle());

                 Schedule newRecommandSchedule = new Schedule();
                 newRecommandSchedule.setLat(place.getLat());
                 newRecommandSchedule.setLng(place.getLng());
                 newRecommandSchedule.setPlaceUid(place.getPlaceUid());
                 newRecommandSchedule.setTurn(newTurn);
                 newRecommandSchedule.setTrip(trip);
                 newRecommandSchedule.setDay(i);

                 scheduleRepository.save(newRecommandSchedule);
                 visti[Math.toIntExact(newRecommandSchedule.getPlaceUid())]=1;

                 tire+=placeRepository.findOneByPlaceUid(newRecommandSchedule.getPlaceUid()).getTire();;
                 if(placeRepository.findOneByPlaceUid(newRecommandSchedule.getPlaceUid()).getPlaceType()==3){
                     restaurant++;
                 }

                 beforeSchdule = fixedSchedule;
                 newTurn++;
                 hungry+=2.6;
                 newAddScheduleCnt--;

             }
             this.registerSchedule(beforeSchdule.getTrip(), i,visti,true,hungry,newTurn,restaurant,tire);
        }
        return null;
    }

}
