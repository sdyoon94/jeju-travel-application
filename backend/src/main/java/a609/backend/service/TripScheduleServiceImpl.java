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
public class TripScheduleServiceImpl implements TripScheduleService {

    @Autowired
    Algorithm algorithm;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    TripRepository tripRepository;


    @Override
    public void registerSchedule(Trip trip, int day, int[] visit, boolean reRecommend, double hungry, int turn, int restaurant, int tired) {
        //test

        int placeType = 0;

        if (day == 0) {//첫째날
            if (turn == 0) {
                turn = algorithm.create(trip, 5, day, 1, turn, visit, hungry, tired, restaurant).getTurn();//공항
            }

            double startTime = trip.getStartTime().toSecondOfDay() / 60 / 60;

            hungry = startTime;

            while (hungry < 20.0) {//8시 이전이면
                placeType = 0;
                if (hungry >= 11.0 && hungry <= 14.0 && restaurant < 1) {
                    placeType = 3;
                }
                if (hungry >= 17.0 && hungry < 20.0 && restaurant < 2) {
                    placeType = 3;
                }

                Algorithm.Check ch = algorithm.create(trip, placeType, day, 1, turn, visit, hungry, tired, restaurant);//관광지 추가
                hungry = ch.getHungry();
                turn = ch.getTurn();
                tired = ch.getTire();
                restaurant = ch.getRestaurant();

            }

//            turn = algorithm.create(trip, 0, day, 2, turn,visit,hungry,tired,restaurant,cafe);//관광지추가
            if (trip.getPeriodInDays() > 1) {//당일치기 아니면 숙소추가
                algorithm.create(trip, 2, day, 1, turn, visit, hungry, tired, restaurant);
            }
            if (trip.getPeriodInDays() == 1) {//당일치기면 공항
                algorithm.create(trip, 5, day, 1, turn, visit, hungry, tired, restaurant);//공항
            }
        } else if (day == trip.getPeriodInDays() - 1) {//마지막날
            hungry = 6.7;
            int endTime = trip.getEndTime().toSecondOfDay() / 60 / 60;
            while (hungry < endTime - 3) {//떠나는시간 3시간전
                placeType = 0;
                if (hungry >= 11.0 && hungry <= 14.0 && restaurant < 1) {
                    placeType = 3;
                }
                if (hungry >= 17.0 && hungry < 20.0 && restaurant < 2) {
                    placeType = 3;
                }

                if (placeType == 3) {
                    log.info("day " + day);
                    log.info("Hungry " + hungry);
                    log.info("tired " + tired);
                    log.info("turn " + turn);
                }

                Algorithm.Check ch = algorithm.create(trip, placeType, day, 1, turn, visit, hungry, tired, restaurant);//관광지 추가
                hungry = ch.getHungry();
                turn = ch.getTurn();
                tired = ch.getTire();
                restaurant = ch.getRestaurant();

            }

//            turn = algorithm.create(trip, 0, day, 2, turn,visit,hungry,tired,restaurant,cafe);//관광지 추가
            algorithm.create(trip, 5, day, 1, turn, visit, hungry, tired, restaurant);//공항

        } else {

            hungry = 6.7;
            while (hungry < 20.0) {//8시 이전이면

                placeType = 0;

                if (hungry >= 11.0 && hungry <= 14.0 && restaurant < 1) {//점심시간
                    placeType = 3;
                } else if (hungry >= 17.0 && hungry < 20.0 && restaurant < 2) {
                    placeType = 3;
                } else if (tired >= 4) { //피로도 4이상이면 카페가기
                    placeType = 4;
                }
                if (placeType == 3) {
                    log.info("day " + day);
                    log.info("Hungry " + hungry);
                    log.info("tired " + tired);
                    log.info("turn " + turn);
                }

                Algorithm.Check ch = algorithm.create(trip, placeType, day, 1, turn, visit, hungry, tired, restaurant);//관광지 추가
                hungry = ch.getHungry();
                turn = ch.getTurn();
                tired = ch.getTire();
                restaurant = ch.getRestaurant();

            }
            algorithm.create(trip, 2, day, 1, turn, visit, hungry, tired, restaurant);//숙소
        }
    }

    @Override
    public List<ScheduleDTO> showTripSceduleList(Long tripId, int day) {
        List<Schedule> schedules = scheduleRepository.findByTripTripIdAndDayOrderByTurn(tripId, day);
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
        Schedule originSchedule = scheduleRepository.findOneByScheduleId(ScheduleId);

        originSchedule.setPlaceName(schedule.getPlaceName());
        originSchedule.setTurn(schedule.getTurn());
        originSchedule.setStayTime(schedule.getStayTime());
        originSchedule.setPlaceName(schedule.getPlaceName());
        originSchedule.setPlaceUid(schedule.getPlaceUid());
        originSchedule.setLat(schedule.getLat());
        originSchedule.setLng(schedule.getLng());
        scheduleRepository.save(originSchedule);

    }

    @Override
    public void deleteSchedule(Long scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }






    //재추천
    @Transactional
    @Override
    public void recommendScheduleList(Map<String, Schedule[]> schedules, Long tripId) {
        int visit[] = new int[4000];
        Schedule firstAirPortSchedule = scheduleRepository.findByTripTripIdAndDayAndTurn(tripId, 0, 0);//첫번째 공항스케줄
        Trip trip = firstAirPortSchedule.getTrip();

        for (int day = 0; day < schedules.size(); day++) {//day별로
            //원래 일정갯수로
            int originScheduleCnt = Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(tripId, day));

            Schedule[] scheduleList = schedules.get(String.valueOf(day));//day별 스케줄리스트

            Schedule startSchedule;
            if (day == 0) {
                startSchedule = firstAirPortSchedule;//공항

            } else {
                int turn = Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(tripId, day));
                startSchedule = scheduleRepository.findByTripTripIdAndDayAndTurn(tripId, day - 1, turn-1);//전날숙소
            }


            int newTurn = 1;
            int fixedScheduledCnt = scheduleList.length;

            int placeType = 0;
//            Place startPlace = placeRepository.findOneByPlaceUid(startSchedule.getPlaceUid());
            double startLat = startSchedule.getLat();
            double startLng = startSchedule.getLng();
//            Place endPlace = null;
            double endLat = 0.0;
            double endLng = 0.0;

            int startTurn = 0;
            int endTurn = 0;
            int forTurn=1;

            int cnt = 0;//추가해야될 일정 수
            for (Schedule fixedSchedule : scheduleList) {//고정된 일정
                int fixedScheduleTurn = scheduleRepository.findOneByScheduleId(fixedSchedule.getScheduleId()).getTurn();
                for (int turn = forTurn; turn < originScheduleCnt; turn++) {
                    if (fixedScheduleTurn == turn) {//고정된 번호 같다면
                        if (cnt > 0) {//추가해야될게 있다면

                            endLat = fixedSchedule.getLat();
                            endLng = fixedSchedule.getLng();

//                            endPlace = placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid());
                            endTurn = turn;

                            binarySearch(startTurn, endTurn,trip,day,cnt,startLat,startLng,endLat,endLng);

                            startLat = endLat;
                            startLng = endLng;
//                            startPlace = endPlace;

                            startTurn = turn;
                            forTurn =turn+1;
                            break;
                        } else {
                            startLat = fixedSchedule.getLat();
                            startLng = fixedSchedule.getLng();
//                            startPlace = placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid());
                            startTurn = turn;
                        }
                        cnt=0;

                        continue;
                    }else {
                        cnt++;

//                    endPlace = placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid());
                    }
                }
            }
        }

    }

    @Transactional
    @Override
    public void deleteOriginalSchedule(int turn, int day, Long tripId) {
        scheduleRepository.deleteByTripTripIdAndDayAndTurn(tripId, day, turn);
    }


    public Place reCreateSchedule(double startLat,double startLng,double endLat,double endLng, int cnt, int placeType, int style, int targetTurn, int day, Trip trip) {

        double lat = (startLat + endLat) / 2.0;
        double lng = (startLng + endLng) / 2.0;

        Place place = algorithm.selectAroundPlace(lat, lng, placeType, style);

        Schedule schedule = new Schedule();
        schedule.setPlaceName(place.getPlaceName());
        schedule.setLat(place.getLat());
        schedule.setLng(place.getLng());
        schedule.setPlaceUid(place.getPlaceUid());
        schedule.setDay(day);
        schedule.setStayTime(120);
        schedule.setTrip(trip);
        schedule.setTurn(targetTurn);

        scheduleRepository.save(schedule);


        return place;

    }

    // 재귀적 탐색
    public void binarySearch(int startTurn, int endTurn,Trip trip,int day,int cnt,double startLat,double startLng,double endLat, double endLng) {
        int targetTurn = (startTurn + endTurn) / 2;

        if (endTurn-startTurn==1) {
            return;
        }

        Long originalTargetPlaceUid = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day, targetTurn).getPlaceUid();//타겟 아이디
        deleteOriginalSchedule(targetTurn, day, trip.getTripId()); //기존일정 삭제
        int placeType = placeRepository.findOneByPlaceUid(originalTargetPlaceUid).getPlaceType();//타겟 타입구하기

        //새로운 장소
        Place targetPlace = reCreateSchedule(startLat,startLng,endLat,endLng,cnt, placeType, trip.getStyle(), targetTurn, day, trip);

        if (targetTurn > startTurn) {

            binarySearch(startTurn, targetTurn,trip,day,cnt,startLat,startLng,targetPlace.getLat(),targetPlace.getLng()); // 왼쪽 부분 탐색
        }
        if (targetTurn < endTurn) {

            binarySearch(targetTurn, endTurn,trip,day,cnt,targetPlace.getLat(),targetPlace.getLng(),endLat,endLng); // 오른쪽 부분 탐색
        }
    }





    //재추천 숙소포함
//    @Transactional
//    @Override
//    public List<ScheduleDTO> recommendScheduleList(Map<String, Schedule[]> schedules, Long tripId) {
//        int visit[] =new int[4000];
//        Schedule firstAirPortSchedule = scheduleRepository.findByTripTripIdAndDayAndTurn(tripId,0,0);//첫번째 공항스케줄
//        Trip trip = firstAirPortSchedule.getTrip();
//
//        for (int i=0; i<schedules.size();i++){//day별로
//
//            int restaurant =0;
//            int tire =0;
//            double hungry =0.0;
//            //원래 일정갯수로
//            int originScheduleCnt = Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(tripId, i));
//
//
//            Schedule[] scheduleList = schedules.get(String.valueOf(i));//day별 스케줄리스트
//            if (scheduleList==null){//날짜가 비었으면
//                this.registerSchedule(trip,i,visit,false,hungry,0,0,0);//처음부터 새로 생성해줘야
//                continue;
//            }
//            scheduleRepository.deleteByTripTripIdAndDay(tripId,i);//날짜별로 삭제
//            Schedule beforeSchedule;
//            if(i==0) {
//                beforeSchedule = firstAirPortSchedule;//공항
//
//            }else{
//                int turn = Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(tripId,i));
//                beforeSchedule = scheduleRepository.findByTripTripIdAndDayAndTurn(tripId,i-1,turn);//전날숙소
//            }
//            scheduleRepository.save(beforeSchedule);
//
//             int newTurn =1;
//             int fixedScheduledCnt = scheduleList.length;
//             log.info(String.valueOf(fixedScheduledCnt));
//             int newAddScheduleCnt=originScheduleCnt-fixedScheduledCnt;
//
//             for (Schedule fixedSchedule : scheduleList) {//재추천 순서는 고정된 일정부터 차례대로
//                 if(newAddScheduleCnt==0){//더 추천해줄 갯수 초과하면 고정된 스케줄 다 넣기 ..근데 이거 거리 순소 고려 안됨..ㅜㅜ
//                     fixedSchedule.setTrip(trip);
//                     fixedSchedule.setDay(i);
//                     fixedSchedule.setTurn(newTurn++);
//
//                     hungry+=1.3;
//                     tire+=placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid()).getTire()*fixedSchedule.getStayTime();
//                     if(placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid()).getPlaceType()==3){
//                         restaurant++;
//                     }
//                     continue;
//                 }
////                Schedule fixedSchedule = scheduleRepository.findOneByScheduleId(schedule.getScheduleId());
//                 if(fixedSchedule.getPlaceUid()==2) {//만약 숙소도 고정하고싶다면 생각 다시 해봐야..
//                    //비포스케줄의 반경에서 다시 검색하고 숙소랑 가운데 일정 잡는 방식으로 추가해야됨.
//
//                 }
//                 fixedSchedule.setTrip(trip);
//                 fixedSchedule.setDay(i);
//                 fixedSchedule.setTurn(newTurn+1);
//                 scheduleRepository.save(fixedSchedule);
//                 tire+=placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid()).getTire()*fixedSchedule.getStayTime();
//                 visit[Math.toIntExact(fixedSchedule.getPlaceUid())]=1;
//
//                 if(placeRepository.findOneByPlaceUid(fixedSchedule.getPlaceUid()).getPlaceType()==3){
//                     restaurant++;
//                 }
//
//                 double lat = (beforeSchedule.getLat()+ fixedSchedule.getLat())/2;
//                 double lng = (beforeSchedule.getLng()+ fixedSchedule.getLng())/2;
//                 int placeType = 0;
//                 if(hungry>=11.5&& hungry<14.0&&restaurant<1){//점심시간
//                      placeType=3;
//                 }
//                 if (hungry>=17.5&&hungry<20.5&&restaurant<2){
//                     placeType=3;
//                 }
//                //가운데 지점 중심으로 검색한 장소
//                 Place place = algorithm.selectAroundPlace(lat,lng,placeType,fixedSchedule.getTrip().getStyle());
//
//                 Schedule newRecommandSchedule = new Schedule();
//                 newRecommandSchedule.setLat(place.getLat());
//                 newRecommandSchedule.setLng(place.getLng());
//                 newRecommandSchedule.setPlaceUid(place.getPlaceUid());
//                 newRecommandSchedule.setTurn(newTurn);
//                 newRecommandSchedule.setTrip(trip);
//                 newRecommandSchedule.setDay(i);
//
//                 scheduleRepository.save(newRecommandSchedule);
//                 visit[Math.toIntExact(newRecommandSchedule.getPlaceUid())]=1;
//
//                 tire+=placeRepository.findOneByPlaceUid(newRecommandSchedule.getPlaceUid()).getTire();;
//                 if(placeRepository.findOneByPlaceUid(newRecommandSchedule.getPlaceUid()).getPlaceType()==3){
//                     restaurant++;
//                 }
//
//                 beforeSchedule = fixedSchedule;
//                 newTurn++;
//                 hungry+=2.6;
//                 newAddScheduleCnt--;
//
//             }
//             this.registerSchedule(beforeSchedule.getTrip(), i,visit,true,hungry,newTurn,restaurant,tire);
//        }
//        return null;
//    }

}
