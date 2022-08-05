import SearchResultItem from "./SearchResultItem"


function SearchResults({ resultLst }) {

  return (
    <>
      {
        resultLst.length === 0
        ? <div className="search-top-margin text-center">
            <p className="subtitle-size" style={{marginTop: "5.5vh"}}>검색 결과가 없습니다.</p>
          </div>
        : <div className="recommend-spots search-top-margin">
            {resultLst.map((item, idx) => 
              <SearchResultItem key={item.placeUid} isLast={idx===resultLst.length - 1} item={item} />
            )}
          </div>
      }
    </>
  )
}

export default SearchResults
