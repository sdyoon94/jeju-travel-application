import Header from "components/Header/Header"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import SearchBody from "components/PlaceSearch/SearchBody"
import SelectedSpots from "components/PlaceSearch/SelectedSpots"
import "./placesearch.css"

function PlaceSearch() {
  const navigate = useNavigate()
  const [spotSearch, setSpotSearch] = useState("")
  const selectedSpots = useSelector(state => state.selectedSpots)

  const handleSpotChange = (e) => {
    setSpotSearch(e.target.value)
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

  const handleInputBtn = () => {
    navigate("/address")
  }

  const handleSubmit = () => {
    navigate("/travel")
    // 장소 추가하는 action
  }

  return (
    <>
      <Header style={{ margin: "3vh 4vw"}} />
      <div className="text-center">
        <img className="search-icon" alt="searchIcon" src="icons/searchIcon.png" />
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
      <SearchBody spotSearch={spotSearch} />
      { selectedSpots.length === 0 
       ? <button onClick={handleInputBtn} className="place-btn block" style={{margin: "5vh auto"}}>직접입력하기</button>
       : <button onClick={handleSubmit} className="place-btn block" style={{margin: "5vh auto"}}>선택완료</button> 
      }
    </>
  )
}

export default PlaceSearch