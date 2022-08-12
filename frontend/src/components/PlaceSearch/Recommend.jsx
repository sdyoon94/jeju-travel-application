import { useState } from "react"
import { useDispatch } from "react-redux"
import { addSpot } from "store/modules/selectedSpotsSlice"


function Recommend({ spot, isLast }) {
  const [checked, setChecked] = useState(false)
  const dispatch = useDispatch()

  const handleClickSpot = (e) => {
    const placeUid = e.target.id
    const placeName = e.target.getAttribute("name")
    if (!checked) {
      dispatch(addSpot({placeUid, placeName}))
    }
    setChecked(true)
  } 

  return (
    <div className="recommend-spot" key={spot.placeUid}>
      <div style={{display: "flex"}}>
        <img className="search-img" style={{alignSelf: "center"}} alt={spot.name} src={spot.imgPath} />
        <div style={{width: "55vw"}}>
          <span className="content-size block">{spot.name}</span>
          {spot.tags.map((tag, idx) => 
            <span className="subcontent-size inline-block" key={idx}>#{tag}</span>
          )}
        </div>
        <span 
          style={{marginLeft: "auto", alignSelf: "center"}}
          onClick={handleClickSpot}
          id={spot.placeUid}
          name={spot.name}
          className="select-click" >선택</span>
      </div>
      {isLast ? null : <hr />}
    </div>
  )
}

export default Recommend