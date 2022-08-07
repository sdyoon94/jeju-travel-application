package a609.backend.util;

import a609.backend.db.entity.Place;
import a609.backend.db.entity.Trip;
import a609.backend.db.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class Algorithm {

    @Autowired
    PlaceRepository placeRepository;

    public Place create(Trip trip,String placeType){

        List<Place> place= placeRepository.findAllByPlaceType(placeType);
        Collections.shuffle(place);


        return  place.get(0);
    }

}
