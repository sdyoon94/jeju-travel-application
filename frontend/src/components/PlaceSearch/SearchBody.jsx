// import { useState } from "react"
// import { useSelector } from "react-redux"
import RecommendList from "./RecommendList"
import SearchResults from "./SearchResults"


function SearchBody({ spotSearch, resultLst }) {

  if (spotSearch) {
    return (
      <>
        <SearchResults resultLst={resultLst} />
      </>
    )
  } else {
    return (
      <RecommendList />
    )
  }
}

export default SearchBody