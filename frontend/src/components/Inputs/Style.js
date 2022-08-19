import "globalStyle.css";
import "./Style.css";
import { ReactComponent as Photospot } from "assets/styles/photospot.svg";
import { ReactComponent as Nature } from "assets/styles/nature.svg";
import { ReactComponent as Activity } from "assets/styles/sport.svg";
import { ReactComponent as Shop } from "assets/styles/shop.svg"
import { ReactComponent as Eat } from "assets/styles/eat.svg"
import { ReactComponent as Crown } from "assets/styles/crown.svg"
import { ReactComponent as Relax } from "assets/styles/relax.svg"


// 여행 스타일 선택
function Style({ inputValues, setInputValues }) {
  const setSvg = (i) => {
    return inputValues.style[i] ? "#1565C0" : "#8C8C8C";
  };

  const styles = [
    {
      eng: "eating",
      kor: "식도락",
      svg: <Eat fill={setSvg(0)} width="5vw" height="5vw" className="style-icon"></Eat>,
    },
    {
      eng: "market",
      kor: "전통시장",
      svg: <Shop fill={setSvg(1)} width="5vw" height="5vw" className="style-icon"></Shop>,
    },
    {
      eng: "phtospot",
      kor: "포토스팟",
      svg: <Photospot fill={setSvg(2)} width="5vw" height="5vw" className="style-icon"></Photospot>,
    },
    {
      eng: "activity",
      kor: "액티비티/체험",
      svg: <Activity fill={setSvg(3)} width="5vw" height="5vw" className="style-icon"></Activity>,
    },
    {
      eng: "popular",
      kor: "유명관광지",
      svg: <Crown fill={setSvg(4)} width="5vw" height="5vw" className="style-icon"></Crown>,
    },
    {
      eng: "nature",
      kor: "자연",
      svg: <Nature fill={setSvg(5)} width="5vw" height="5vw" className="style-icon"></Nature>,
    },
    {
      eng: "relax",
      kor: "여유",
      svg: <Relax fill={setSvg(6)} width="5vw" height="5vw" className="style-icon"></Relax>,
    },
  ];


  const isClicked = (i) => {
    let newArray = [...inputValues.style];
    newArray[i] = newArray[i] * -1 + 1;
    setInputValues(["style", newArray]);
  };

  const setButton = (i) => {
    return {
      border: inputValues.style[i] ? "2px solid #1565C0" :"2px solid #8C8C8C",
      color: inputValues.style[i] ? "#1565C0" : "#8C8C8C",
    };
  };

  return (
    <div className="style-container">
      <div className="style-header">
        <div className="inline-block subcontentfont-weight title-size">
          <span className="color-1" >어떤</span>
          <span> 여행을 할까요?</span>
        </div>
        <div className="subcontentfont-weight content-size text-center gray">취향에 맞는 일정과 장소를 추천드려요!</div>
      </div>
      <div className="style-body">
        <div className="subtitle-size">여행 스타일</div>
        <div className="style-select-btns">
          {styles.map((style, i) => {
            return (
              <button
                type="button"
                key={i}
                id={style.eng}
                onClick={() => isClicked(i)}
                style={setButton(i)}
              >
                {style.svg}
                <span>{style.kor}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Style;
