import Header from "components/Header/Header"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import SearchBody from "components/PlaceSearch/SearchBody"
import SelectedSpots from "components/PlaceSearch/SelectedSpots"
import RecommendList from "components/PlaceSearch/RecommendList"
import { addSchedule } from "store/modules/travelSlice"
import { resetSpot } from "store/modules/selectedSpotsSlice"
import api from "api"
import "./placesearch.css"

function PlaceSearch() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [spotSearch, setSpotSearch] = useState("")
  const [resultLst, setresultLst] = useState([])
  const selectedSpots = useSelector(state => state.selectedSpots)
  const socket = useSelector(state => state.socket.socket)
  
  const inputSearch = async(query) => {
    const response = await axios.get(api.place.searchUrl(query))
    setresultLst(response.data.findPlaces)
  }

  const handleSpotChange = (e) => {
    setSpotSearch(e.target.value)
    if (e.target.value) {
      inputSearch(e.target.value)
    }
  }

  const [ containerStyle, setContainerStyle ] = useState({
    borderBottom: "2px solid black"
  })

  const handleFocus = () => {
    setContainerStyle({
      ...containerStyle,
      borderBottom: "2px solid #1E88E5"
    })
  }

  const handleFocusOut = () => {
    setContainerStyle({
      ...containerStyle,
      borderBottom: "2px solid black"
    })
  }
  
  const { travelId, dayId } = useParams()

  const handleInputBtn = () => {
    navigate(`/address/${travelId}/${dayId}`)
  }
  
  const handleSubmit = () => {
    navigate(`/travel/${travelId}`)
    socket.emit("grant schedules authority", { day: dayId }, (response) => {
      if (response.status === "ok") {
        dispatch(addSchedule({ dayId, selectedSpots}))
        dispatch(resetSpot())
        // socket.emit("create schedule")
      }
    })
    
  }
  
  const handleSubmitInputBtn = () => {

    navigate(`/address/${travelId}/${dayId}`)
    dispatch(addSchedule({ dayId, selectedSpots}))
    dispatch(resetSpot())
  }

  return (
    <>
      <Header style={{ margin: "3vh 4vw"}} />
      <div className="text-center">
        <img className="search-icon" alt="searchIcon" src="/icons/searchIcon.png" />
        <div style={containerStyle} className="search-input-container">
          <input autoFocus className="search-input"
            value={spotSearch}
            onChange={handleSpotChange} 
            onFocus={handleFocus} 
            onBlur={handleFocusOut}
          />
        </div>
      </div>
      { selectedSpots.length === 0 ? null : <SelectedSpots /> }
      <SearchBody spotSearch={spotSearch} resultLst={resultLst} />
      { selectedSpots.length !== 0 && resultLst.length === 0 && spotSearch &&
        <div className="text-center">
        <p onClick={handleSubmitInputBtn} className="content-size" style={{ marginTop: "5vh", cursor: "pointer"}}>장소 직접 추가하러 가기!</p>
        <p className="content-size gray">지금까지 선택된 장소는 자동으로 일정에 추가돼요.</p>
        </div>
      }
      { selectedSpots.length === 0 && resultLst.length === 0 && spotSearch &&
        <p className="content-size gray text-center">찾는 장소가 없다면 직접 입력해보세요!</p>
      }
      { selectedSpots.length === 0 
       ? <button onClick={handleInputBtn} className="place-btn block" style={{margin: "5vh auto"}}>직접입력하기</button>
       : <button onClick={handleSubmit} className="place-btn block" style={{margin: "5vh auto"}}>선택완료</button> 
      }
      { selectedSpots.length === 0 && resultLst.length === 0 && spotSearch &&
        <div>
          <hr />
          <RecommendList />
        </div>
      }
    </>
  )
}

export default PlaceSearch