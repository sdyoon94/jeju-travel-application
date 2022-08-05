package a609.backend.service;

import a609.backend.db.repository.PlaceRepository;
import a609.backend.payload.response.FindPlaceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


public interface PlaceService {

    List<FindPlaceDTO> findPlace(String keyword);

}
