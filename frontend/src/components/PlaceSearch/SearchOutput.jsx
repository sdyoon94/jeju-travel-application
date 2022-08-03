import { useState } from "react"
// import axios from "axios"
import recommendList from "dummies/recommendList.json"
import Checkbox from '@mui/material/Checkbox'


function SearchOutput() {
  const [recommendSpots, setRecommendSpots] = useState(recommendList.recommendSpots)

  return (
    <div>
      <p style={{ margin: "2vh 10vw"}}>추천장소</p>
      {recommendSpots.map((spot, idx) =>
        <div className="recommend-spot" key={spot.placeUid}>
          <div style={{display: "flex"}}>
            <img className="search-img" alt={spot.name} src={spot.imgPath} />
            <div>
              <span className="content-size block">{spot.name}</span>
                {spot.tags.map((tag, idx) => 
                  <span className="subcontent-size" key={idx}>#{tag}</span>
                )}
            </div>
            <Checkbox />
          </div>

          {idx === recommendSpots.length - 1 ? null : <hr />}
        </div>
      )}
    </div>
  )
}

export default SearchOutput