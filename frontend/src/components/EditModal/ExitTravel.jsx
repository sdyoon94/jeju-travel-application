import "globalStyle.css";
import "./EditTravelName.css";

// 여행 경비 입력
function ExitTravel({inputValues,setInputValues}) {

  return (
    <div className="title-container">
      <div className="title-header" style={{display:"grid", justifyContent:"center"} }>
        <div className="inline-block subcontentfont-weight title-size text-center">
          <span>여행을 </span>
          <span style={{color: 'red'}}>삭제 </span>
          <span>하시겠어요?</span>
        </div>
        <div style={{marginTop: "1vh"}} className="subcontentfont-weight content-size text-center gray">삭제된 일정은 다시 볼 수 없어요</div>
      </div>
    </div>
    
  );
}

export default ExitTravel