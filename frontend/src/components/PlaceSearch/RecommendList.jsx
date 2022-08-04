import { useState } from "react"
// import axios from "axios"
import recommendList from "dummies/recommendList.json"
import Recommend from "./Recommend"


function RecommendList() {
  const recommendSpots = useState(recommendList.recommendSpots)[0]

  return (
    <div>
      <p style={{ margin: "2vh 10vw"}}>추천장소</p>
      <div className="recommend-spots">
      {recommendSpots.map((spot, idx) =>
        <Recommend key={spot.placeUid} isLast={idx===recommendSpots.length - 1} spot={spot} />
      )}
      </div>
    </div>
  )
}

export default RecommendList