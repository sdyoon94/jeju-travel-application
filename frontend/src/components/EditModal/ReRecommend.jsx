import "globalStyle.css";
import "./EditTravelName.css";

// 여행 경비 입력
function ReRecommend({inputValues,setInputValues}) {

  return (
    <div className="title-container">
      <div className="title-header">
      <div className="inline-block subcontentfont-weight title-size" >
          여행 스타일이 변경되어 
      </div>
      <div className="inline-block subcontentfont-weight title-size" >
          <span>코스를 </span>
          <span style={{color: 'red'}}>재추천 </span>
          <span>받을 수 있습니다</span>
      </div>
      
      </div>
    </div>
    
  );
}

export default ReRecommend