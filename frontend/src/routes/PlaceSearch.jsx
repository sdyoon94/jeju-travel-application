import Header from "components/Header/Header"
import { useState } from "react"
import SearchOutput from "components/PlaceSearch/SearchOutput"
import "./placesearch.css"

function PlaceSearch() {
  const [spotSearch, setSpotSearch] = useState("")

  const handleSpotChange = (e) => {
    setSpotSearch(e.target.value)
  }

  const [ containerStyle, setContainerStyle ] = useState({
    display: "inline-block",
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
      <Header />
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
      <SearchOutput />
    </>
  )
}

export default PlaceSearch