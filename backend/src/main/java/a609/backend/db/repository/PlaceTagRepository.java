package a609.backend.db.repository;

import a609.backend.db.entity.PlaceTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceTagRepository extends JpaRepository<PlaceTag, Long> {

    PlaceTag save(PlaceTag placeTag);








}
