// import { useState } from "react"
// import { useSelector } from "react-redux"
// // import axios from "axios"
import RecommendList from "./RecommendList"
import SearchResults from "./SearchResults"


function SearchBody({spotSearch}) {

  if (spotSearch) {
    return (
      <>
        <SearchResults />
      </>
    )
  } else {
    return (
      <>
        <RecommendList />
      </>
    )
  }
}

export default SearchBody