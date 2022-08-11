package a609.backend.util;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.ScheduleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class Algorithm {

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    ScheduleRepository scheduleRepository;

    public int create(Trip trip, int placeType, int day, int cnt, int startTurn) {

        for (int i = 0; i < cnt; i++) {
            Schedule schedule = new Schedule();
            schedule.setDay(day);
            schedule.setTrip(trip);
            if (placeType == 5) {//공항이면
                Place place = placeRepository.findOneByPlaceUid(3762L);
                schedule.setLat(place.getLat());
                schedule.setLng(place.getLng());
                schedule.setPlaceName(place.getPlaceName());
                schedule.setPlaceUid(place.getPlaceUid());
                if (day == 0 && startTurn == 0) {//첫쨋날 시작시간 지정
                    schedule.setStayTime(trip.getStartTime().toSecondOfDay() / 60);
                }


            } else if (startTurn == 0) {//0번째 일정은 9시로 시작시간 설정하고 전날 잡은 숙소로 장소 설정

                int turn = Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(trip.getTripId(), day - 1));
                Schedule schedule1 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day - 1, turn - 1);//전날 숙소를 시작장소로

                schedule.setPlaceUid(schedule1.getPlaceUid());//전날 잡은 숙소로
                schedule.setPlaceName(schedule1.getPlaceName());
                schedule.setLat(schedule1.getLat());
                schedule.setLng(schedule1.getLng());

                schedule.setStayTime(540);
            } else if (day==0&&startTurn==1) {//첫째날은 공항 주변
                Schedule schedule1 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), 0, 0);
                Place place = selectFirstDayPlace(schedule1.getLat(),schedule1.getLng(),placeType);//공항 중심으로
                schedule.setPlaceUid(place.getPlaceUid());
                schedule.setPlaceName(place.getPlaceName());
                schedule.setLat(place.getLat());
                schedule.setLng(place.getLng());

            } else {
                Schedule schedule1;
                Schedule schedule2;
                //전 일정 반경으로 설정
                if(startTurn==1) {//첫번째 순서는 전날 마지막 일정과 숙소로
                    int turn = Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(trip.getTripId(), day - 1));
                    schedule1 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day-1, turn - 2);
                    schedule2 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day-1, turn - 1);
                }else {//이전 장소 1 2로
                    schedule1 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day, startTurn - 2);
                    schedule2 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day, startTurn - 1);
                }
//                place.setLat(scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(),day,0).getPlace().getLat());
//                place.setLng(scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(),day,0).getPlace().getLng());
                log.info(trip.getTripId().toString());


                Place place = selectPlace(schedule1.getLat(), schedule1.getLng(),schedule2.getLat(),schedule2.getLng(), placeType);

                schedule.setPlaceUid(place.getPlaceUid());//전날 잡은 숙소로
                schedule.setPlaceName(place.getPlaceName());
                schedule.setLat(place.getLat());
                schedule.setLng(place.getLng());
            }


            schedule.setTurn(startTurn++);
            scheduleRepository.save(schedule);
        }
        return startTurn;

    }

    //이전 장소 반경 내 장소 선택
    public Place selectPlace(double lat1, double lng1,double lat2,double lng2, int placeType) {//인자 스타일 추가

        List<Place> places = new ArrayList<>();
        //외점구해서 찾기

//        //latlng 2구하기
//        places = placeRepository.findTourByDistance(lat1, lng1, 8.0, placeType);
//        Collections.shuffle(places);
//        Place place2 = places.get(0);

        double d = distanceInKilometerByHaversine(lat1,lng1,lat2,lng2);
        //외점
        double distance=8.0;
        Point outPoint = outPoint(lat1,lng1,lat2,lng2,d);
        log.info("-----------------------------"+String.valueOf(outPoint.lat));
        log.info(String.valueOf(outPoint.lng));

        while (places.isEmpty()){


            places = placeRepository.findTourByDistance(outPoint.lat,outPoint.lng,distance,placeType);
            distance+=2.0;
        }

        log.info(String.valueOf(places.size()));
        Collections.shuffle(places);

        return places.get(0);
    }

    //첫쨋날 공항
    public Place selectFirstDayPlace(double lat1, double lng1, int placeType) {//인자 스타일 추가

        List<Place> places = new ArrayList<>();
        //외점구해서 찾기

        //latlng 2구하기
        places = placeRepository.findTourByDistance(lat1, lng1, 8.0, placeType);
        Collections.shuffle(places);
        Place place2 = places.get(0);
        return places.get(0);
    }


    public static class Point{
      double lat;
      double lng;
        public Point(double lat,double lng) {
            super();
            this.lat = lat;
            this.lng = lng;
        }
    }

    public static Point outPoint(double lat1,double lng1, double lat2,double lng2, double d){


        double lat = ((d+8)*lat2-8*lat1)/d;
        double lng = ((d+8)*lng2-8*lng1)/d;
        Point point = new Point(lat,lng);

        return point;
    }


    public static double distanceInKilometerByHaversine(double x1, double y1, double x2, double y2) {
        double distance;
        double radius = 6371; // 지구 반지름(km)
        double toRadian = Math.PI / 180;

        double deltaLatitude = Math.abs(x1 - x2) * toRadian;
        double deltaLongitude = Math.abs(y1 - y2) * toRadian;

        double sinDeltaLat = Math.sin(deltaLatitude / 2);
        double sinDeltaLng = Math.sin(deltaLongitude / 2);
        double squareRoot = Math.sqrt(
                sinDeltaLat * sinDeltaLat +
                        Math.cos(x1 * toRadian) * Math.cos(x2 * toRadian) * sinDeltaLng * sinDeltaLng);

        distance = 2 * radius * Math.asin(squareRoot);

        return distance;
    }

}
