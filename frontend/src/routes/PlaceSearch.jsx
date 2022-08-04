import Header from "components/Header/Header"
import { useState } from "react"
import { useSelector } from "react-redux"
import SearchBody from "components/PlaceSearch/SearchBody"
import SelectedSpots from "components/PlaceSearch/SelectedSpots"
import SearchBtn from "components/PlaceSearch/SearchBtn"
import "./placesearch.css"

function PlaceSearch() {
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
      { selectedSpots.length === 0 ? <SearchBtn content="직접입력하기" /> : <SearchBtn content="선택 완료" /> }
    </>
  )
}

export default PlaceSearch