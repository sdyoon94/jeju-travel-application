import TravelSummary from "./TravelSummary"
import NewUser from "./NewUser"
import NewTravelBtn from "./NewTravelBtn"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { getTravelInfo } from "store/modules/travelListSlice"


function TravelList() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTravelInfo())
  }, [])

  const travels = useSelector((state => state.travelList.travelList))
  console.log(travels)
  const nickName = useSelector((state => state.auth.nickname))


  return (
    <>
      {travels.length 
      ?
      (
      <div className="margin-top-travel">
        <div className="text-center title-margin">
          <img className="pin" src="icons/pin.png" alt="압정" />
          <span className="subtitle-size">{nickName}님의 <span className="color-1">제주 여행 계획</span></span>
        </div>
        <div className="trip-list-box">
          {travels.map((travel, idx) =>  
          <TravelSummary
          key={travel.tripId}
          travelUid={travel.tripId}
          idx={idx}
          title={travel.tripName}
          startDate={travel.startDate}
          period={travel.periodInDays}
          members={travel.member}
          travelLength={travels.length}
          />)}
        </div>
        <div className="text-center">
          <NewTravelBtn content="제주도로 또 가기" />
        </div>
      </div>
      )
      :
      <NewUser />
      }
    </>
  )
}

export default TravelList