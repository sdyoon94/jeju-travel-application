import "globalStyle.css";
import "./Style.css";

// const btns =

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
          <div>일</div>
          <div>단</div>
          <div>보</div>
          <div>류</div>
          <div>!</div>
        </div>
      </div>
    </div>
  );
}

export default Style;
