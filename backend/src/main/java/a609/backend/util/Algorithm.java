package a609.backend.util;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Schedule;
import a609.backend.db.entity.Trip;
import a609.backend.db.repository.PlaceRepository;
import a609.backend.db.repository.ScheduleRepository;
import lombok.Getter;
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

    @Getter
    public static class Check {
        double hungry;
        int tire, restaurant, turn;

        public Check(double hungry, int tire, int restaurant, int turn) {
            this.hungry = hungry;
            this.tire = tire;
            this.restaurant = restaurant;
            this.turn = turn;
        }

        @Override
        public String toString() {
            return "Check{" +
                    "hungry=" + hungry +
                    ", tire=" + tire +
                    ", restaurant=" + restaurant +
                    ", turn=" + turn +
                    '}';
        }
    }

    public Check create(Trip trip, int placeType, int day, int cnt, int startTurn, int[] visit, double hungry, int tired, int restaurant) {

        Check checkList = null;
        for (int i = 0; i < cnt; i++) {
            Schedule schedule = new Schedule();
            schedule.setDay(day);
            schedule.setTrip(trip);
            if (placeType == 5) {//공항이면
                Place place = placeRepository.findOneByPlaceName("제주공항");
                visit[Math.toIntExact(place.getPlaceUid())] = 1;
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

                visit[Math.toIntExact(schedule1.getPlaceUid())] = 1;
                schedule.setPlaceUid(schedule1.getPlaceUid());//전날 잡은 숙소로
                schedule.setPlaceName(schedule1.getPlaceName());
                schedule.setLat(schedule1.getLat());
                schedule.setLng(schedule1.getLng());
                schedule.setStayTime(540);
            } else if (day == 0 && startTurn == 1) {//첫째날은 공항 주변
                Schedule schedule1 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), 0, 0);
                Place place = selectAroundPlace(schedule1.getLat(), schedule1.getLng(), placeType, trip.getStyle());//공항 중심으로

                visit[Math.toIntExact(schedule1.getPlaceUid())] = 1;
                schedule.setPlaceUid(place.getPlaceUid());
                schedule.setPlaceName(place.getPlaceName());
                schedule.setLat(place.getLat());
                schedule.setLng(place.getLng());
                schedule.setStayTime(120);


            } else {
                Schedule schedule1;
                Schedule schedule2;
                //전 일정 반경으로 설정
                if (startTurn == 1) {//첫번째 순서는 전날 마지막 일정과 숙소로
                    int turn = Math.toIntExact(scheduleRepository.countByTripTripIdAndDay(trip.getTripId(), day - 1));
                    schedule1 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day - 1, turn - 2);
                    schedule2 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day - 1, turn - 1);
                } else {//이전 장소 1 2로
                    schedule1 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day, startTurn - 2);
                    schedule2 = scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(), day, startTurn - 1);
                }
//                place.setLat(scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(),day,0).getPlace().getLat());
//                place.setLng(scheduleRepository.findByTripTripIdAndDayAndTurn(trip.getTripId(),day,0).getPlace().getLng());
                log.info(trip.getTripId().toString());


                Place place = selectPlace(schedule1.getLat(), schedule1.getLng(), schedule2.getLat(), schedule2.getLng(), placeType, visit, trip.getStyle(), hungry);

                visit[Math.toIntExact(place.getPlaceUid())] = 1;
                schedule.setPlaceUid(place.getPlaceUid());//전날 잡은 숙소로
                schedule.setPlaceName(place.getPlaceName());
                schedule.setLat(place.getLat());
                schedule.setLng(place.getLng());
                schedule.setStayTime(120);
            }
            Place place = placeRepository.findOneByPlaceUid(schedule.getPlaceUid());
            tired += place.getTire();


            if (placeType == 4) {//카페가면 피로도 -3
                tired = Math.max(tired - 3, 0);
            }

            //시간
            if (placeType == 3) {//밥먹으면 피로도 리셋
                hungry += 1.3;
                schedule.setStayTime(60);
                tired = 0;
                restaurant++;
            } else{
                hungry += 2.4;
            }
            //여유면 1시간 더
            for(int s=0;s<7;s++) {
                if ((trip.getStyle() & (1 << s)) >0) {
                    if (s==0) hungry+=0.3;
                }
            }

            schedule.setTurn(startTurn++);
            scheduleRepository.save(schedule);
            checkList = new Check(hungry, tired, restaurant, startTurn);

        }
        return checkList;

    }

    //이전 장소 반경 내 장소 선택
    public Place selectPlace(double lat1, double lng1, double lat2, double lng2, int placeType, int[] visit, int style, double hungry) {//인자 스타일 추가

        List<Place> places = new ArrayList<>();
        List<Place> resultPlaces = new ArrayList<>();
        //외점구해서 찾기

//        //latlng 2구하기
//        places = placeRepository.findTourByDistance(lat1, lng1, 8.0, placeType);
//        Collections.shuffle(places);
//        Place place2 = places.get(0);
//        double d = distanceInKilometerByHaversine(lat1,lng1,lat2,lng2);
        //외점
        double distance = 8.0;
        log.info("------outpoint 위-----------------------" + lat1);
        log.info(String.valueOf(lat2));
        log.info(String.valueOf(lng1));
        log.info(String.valueOf(lng2));
        Point outPoint = outPoint(lat1, lng1, lat2, lng2);
        log.info("-----------------------------" + String.valueOf(outPoint.lat));
        log.info(String.valueOf(outPoint.lng));
        Place place;


        //do while 돌 경우 places에 한두개만 있으면 계속 무한로프.. 반경 넗게 재검색해야..
        resultPlaces.clear();
        //스타일에 따른 선택
        String st = String.valueOf(style);

        while (resultPlaces.isEmpty()) {
//
//            for(int i=0;i<7;i++){
//                if((style&(1<<i))==(1<<i)){

            for(int i=0;i<7;i++) {
                if ((style & (1 << i)) >0) {


                    if (i == 0) {//여유는 액티비티 등산 빼고
                        places = placeRepository.findRelaxByDistance(outPoint.lat, outPoint.lng, distance, placeType, 3, 7);
                        for (Place k : places) {
                            if (visit[Math.toIntExact(k.getPlaceUid())] == 1) {
                                continue;
                            }
                            resultPlaces.add(k);
                        }

                    } else {
                        places = placeRepository.findToursByDistance(outPoint.lat, outPoint.lng, distance, placeType, 6-i);
                        for (Place k : places) {
                            if (visit[Math.toIntExact(k.getPlaceUid())] == 1) {
                                continue;
                            }
                            resultPlaces.add(k);
                        }
                    }

                }
                if (resultPlaces.isEmpty()) {//알맞은 스타일 없다면..스타일 없는 것까지 검색
                    places = placeRepository.findToursByDistance(outPoint.lat, outPoint.lng, distance, placeType, 9);
                    for (Place k : places) {
                        if (visit[Math.toIntExact(k.getPlaceUid())] == 1) {
                            continue;
                        }
                        resultPlaces.add(k);
                    }
                }
//                if (resultPlaces.isEmpty()) {//그래도 없다면..
//                    places= placeRepository.findTourByDistance(outPoint.lat,outPoint.lng,distance,placeType);
//                    resultPlaces.addAll(places);
//                }
                distance += 2.0;
            }
        }

        log.info("결과 List size " + String.valueOf(resultPlaces.size()));

        //인기순
        Collections.sort(resultPlaces, (o1, o2) -> o1.getThumbs() - o2.getThumbs());
        resultPlaces = resultPlaces.subList(0, Math.min(resultPlaces.size(), 7));
        Collections.shuffle(resultPlaces);
//

        place = resultPlaces.get(0);
        log.info(String.valueOf(visit[Math.toIntExact(place.getPlaceUid())]));

        return place;
    }

    //첫쨋날 반경 내 검색
    public Place selectAroundPlace(double lat1, double lng1, int placeType, int style) {//인자 스타일 추가

        List<Place> places = new ArrayList<>();

        String st = String.valueOf(style);

        for (int i = 6; i >= 7 - st.length(); i--) {
            int flag = st.charAt(6 - i) - '0';

            if (flag == 0) continue;

            places = placeRepository.findToursByDistance(lat1, lng1, 8.0, placeType, style);

        }
        if (places.isEmpty()) {//알맞은 스타일 없다면..
            places = placeRepository.findTourByDistance(lat1, lng1, 8.0, placeType);
        }
        //latlng 2구하기
        Collections.shuffle(places);
        return places.get(0);
    }


    public static class Point {
        double lat;
        double lng;

        public Point(double lat, double lng) {
            super();
            this.lat = lat;
            this.lng = lng;
        }

        @Override
        public String toString() {
            return "Point{" +
                    "lat=" + lat +
                    ", lng=" + lng +
                    '}';
        }
    }

    public static Point outPoint(double lat1, double lng1, double lat2, double lng2) {

        double d = distanceInKilometerByHaversine(lat1, lng1, lat2, lng2);

//        //중복체크하고 지우기~ 중복체크 안해서 같은 장소 반환으로 d=0 에러!
        //장소 달라도 좌표 같은 곳이 존재..
        if (d < 0.0001) {
            return new Point(lat1, lng1);
        }


        double lat = ((d + 8) * lat2 - 8 * lat1) / d;
        double lng = ((d + 8) * lng2 - 8 * lng1) / d;


        Point point = new Point(lat, lng);
        log.info("outPoint메소드 안--------------" + point.toString());
        log.info("d:" + d + "lat: " + lat + "lng: " + lng);

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
