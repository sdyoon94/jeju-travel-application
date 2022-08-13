package a609.backend.db.repository;

import a609.backend.db.entity.Place;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    Place save(Place place);

    List<Place> findByPlaceNameContains(String Keyword);
    Place findOneByPlaceUid(Long placeUid);

    List<Place> findAllByPlaceType(int placeType);


    //km단위, 반경 내의 관광지를 검색
//    @Query(value = "select * from Place p where (6371*acos(cos(radians(:lng))*cos(radians(p.lng))*cos(radians(p.lat)-radians(:lat))+sin(radians(:lng))*sin(radians(p.lng))))<:distance and p.place_type=0;", nativeQuery = true)
//    List<Place> findTourByDistance(@Param("lat") Double lat, @Param("lng") Double lng, @Param("distance") Double distance);
//
//    //km단위, 반경 내의 밥을 검색
//    @Query(value = "select * from Place p where (6371*acos(cos(radians(:lng))*cos(radians(p.lng))*cos(radians(p.lat)-radians(:lat))+sin(radians(:lng))*sin(radians(p.lng))))<:distance and p.place_type=3;", nativeQuery = true)
//    List<Place> findBobByDistance(@Param("lat") Double lat, @Param("lng") Double lng, @Param("distance") Double distance);
//
//    //km단위 , 반경 내 호텔
//    @Query(value = "select * from Place p where (6371*acos(cos(radians(:lng))*cos(radians(p.lng))*cos(radians(p.lat)-radians(:lat))+sin(radians(:lng))*sin(radians(p.lng))))<:distance and p.place_type=2;", nativeQuery = true)
//    List<Place> findHotelByDistance(@Param("lat") Double lat, @Param("lng") Double lng, @Param("distance") Double distance);

    //    km단위 타입으로
    @Query(value = "select * from Place p where (6371*acos(cos(radians(:lng))*cos(radians(p.lng))*cos(radians(p.lat)-radians(:lat))+sin(radians(:lng))*sin(radians(p.lng))))<:distance and p.place_type=:placeType", nativeQuery = true)
    List<Place> findTourByDistance(@Param("lat") Double lat, @Param("lng") Double lng, @Param("distance") Double distance, @Param("placeType") Integer placeType);
//

    //스타일 포함 검색
    @Query(value = "select * from Place p where (6371*acos(cos(radians(:lng))*cos(radians(p.lng))*cos(radians(p.lat)-radians(:lat))+sin(radians(:lng))*sin(radians(p.lng))))<:distance and p.place_type=:placeType and p.style=:style", nativeQuery = true)
    List<Place> findToursByDistance(@Param("lat") Double lat, @Param("lng") Double lng, @Param("distance") Double distance, @Param("placeType") Integer placeType,@Param("style") Integer style);

    //여유일때
    @Query(value = "select * from Place p where (6371*acos(cos(radians(:lng))*cos(radians(p.lng))*cos(radians(p.lat)-radians(:lat))+sin(radians(:lng))*sin(radians(p.lng))))<:distance and p.place_type=:placeType  and NOT p.style IN (:style1,:style2)", nativeQuery = true)
    List<Place> findRelaxByDistance(@Param("lat") Double lat, @Param("lng") Double lng, @Param("distance") Double distance, @Param("placeType") Integer placeType,@Param("style1") Integer style1,@Param("style2") Integer style2);



//
}
