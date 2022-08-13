import { useState, useEffect } from "react"
import axios from "axios"
import api from "api"
import Recommend from "./Recommend"
import { useParams } from "react-router-dom"


function RecommendList() {
  const [recommendSpots, setRecommendSpots] = useState([])
  const { travelId, dayId } = useParams()

  useEffect(() => {
    fetchRecommend()
  }, [])
  
  const fetchRecommend = async() => {
    const response = await axios.get(api.place.recommendUrl(travelId, dayId))
    setRecommendSpots(response.data.recommendPlaces)
  } 


  return (
    <div>
      <p style={{ margin: "2vh 10vw"}}>추천장소</p>
      <div className="recommend-spots">
      {recommendSpots.map((spot, idx) =>
        <Recommend
         key={spot.placeUid} 
         isLast={idx===recommendSpots.length - 1} 
         spot={spot} />
      )}
      </div>
    </div>
  )
}

export default RecommendList