import "globalStyle.css";
import "./Style.css";

// const imgg = <input type="image" src="https://item.kakaocdn.net/do/493188dee481260d5c89790036be0e66f604e7b0e6900f9ac53a43965300eb9a" style={{border: "double", height: "80px", width:"170px"}}/> 


// 여행 스타일 선택
function Style() {
  return (
    <div className="style-container">
      <div className="style-header">
        <div className="mention" style={{ color: "#1E88E5" }}>
          어떤 여행을 할까요?
        </div>
        <div className="mention2">취향에 맞는 일정과 장소를 추천해드려요</div>
      </div>
      <div className="style-body">
        <div className="style-select-btns">
        <div className="style-title">여행계획세우기</div>

          <button type="button"><img src="https://item.kakaocdn.net/do/493188dee481260d5c89790036be0e66f604e7b0e6900f9ac53a43965300eb9a" alt=""></img>이미지</button>
          <input type="image" src="https://item.kakaocdn.net/do/493188dee481260d5c89790036be0e66f604e7b0e6900f9ac53a43965300eb9a" style={{border: "double", height: "80px", width:"170px"}}/> 

        </div>
      </div>
    </div>
  );
}

export default Style;
