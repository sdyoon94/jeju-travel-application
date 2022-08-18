import "globalStyle.css";
import "./EditTravelName.css";

// 여행 경비 입력
function ReRecommend({ inputValues, setInputValues }) {

  return (
    <div style={{display:'grid', justifyContent:"center"}}>
      <div className="inline-block subtitle-size subcontentfont-weight text-center" >
          여행 스타일이 변경되어 
      </div>
      <div className="inline-block subtitle-size subcontentfont-weight" style={{ lineHeight: '8vw'} } >
          <span>코스를 </span>
          <span style={{color: 'red'}}>재추천 </span>
          <span>받을 수 있습니다</span>
      </div>
      </div>     
  );
}

export default ReRecommend