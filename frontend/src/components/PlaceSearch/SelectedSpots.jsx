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
        <div key={place.uid} className="inline-block">
          <span className="subcontent-size">{place.name} 
            <span id={place.uid} onClick={handleDelete} style={{cursor: "pointer"}}> X</span>
          </span>
        </div>
      )}
    </div>
  )
}

export default SelectedSpots