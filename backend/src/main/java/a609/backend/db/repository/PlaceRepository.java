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

    List<Place> findAllByPlaceType(String placeType);


    //km단위
    @Query(value = "select * from Place p where (6371*acos(cos(radians(:lng))*cos(radians(p.lng))*cos(radians(p.lat)-radians(:lat))+sin(radians(:lng))*sin(radians(p.lng))))<:distance and p.place_type=0;", nativeQuery = true)
    List<Place> findTourByDistance(@Param("lat") Double lat, @Param("lng") Double lng, @Param("distance") Double distance);


}
