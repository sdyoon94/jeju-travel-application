import { useSelector, useDispatch } from "react-redux"
import { deleteSpot } from "store/modules/selectedSpotsSlice"


function SelectedSpots() {
  const selected = useSelector(state => state.selectedSpots)
  const dispatch = useDispatch()

  const handleDelete = (e) => {
    const uid = e.target.id
    dispatch(deleteSpot(uid))
  }

  return(
    <div className="selected-box">
      {selected.map(place => 
        <div key={place.placeUid} className="inline-block">
          <span className="subcontent-size">{place.placeName} 
            <span id={place.placeUid} onClick={handleDelete} style={{cursor: "pointer"}}> X</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default SelectedSpots