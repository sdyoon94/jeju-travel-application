package a609.backend.db.repository;

import a609.backend.db.entity.Place;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {

    Place save(Place place);

    List<Place> findByPlaceNameContains(String Keyword);



}
