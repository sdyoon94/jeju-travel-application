import { useState } from "react"
import { Checkbox } from "@mui/material"
import { useDispatch } from "react-redux"
import { addSpot, deleteSpot } from "store/modules/selectedSpotsSlice"


function Recommend({ spot, isLast }) {
  const [checked, setChecked] = useState(false)
  const dispatch = useDispatch()

  const handleClickSpot = (e) => {
    const name = e.target.name
    const uid = e.target.value
    if (checked) {
      dispatch(deleteSpot(uid))
    } else {
      dispatch(addSpot({uid, name}))
    }
    setChecked(!checked)
  } 

  return (
    <div className="recommend-spot" key={spot.placeUid}>
      <div style={{display: "flex"}}>
        <img className="search-img" alt={spot.name} src={spot.imgPath} />
        <div>
          <span className="content-size block">{spot.name}</span>
          {spot.tags.map((tag, idx) => 
            <span className="subcontent-size inline-block" key={idx}>#{tag}</span>
          )}
        </div>
        <Checkbox
          onChange={handleClickSpot}
          value={spot.placeUid}
          checked={checked}
          name={spot.name} 
          style={{marginLeft: "auto"}} 
        />
      </div>
      {isLast ? null : <hr />}
    </div>
  )
}

export default Recommend