import { useState } from "react";
import "globalStyle.css";
import "./Style.css";
import {ReactComponent as Eating} from 'assets/styles/eating.svg'
import {ReactComponent as Photospot} from 'assets/styles/photospot.svg'
import {ReactComponent as Nature} from 'assets/styles/nature.svg'
import {ReactComponent as Activity} from 'assets/styles/activity.svg'


// const imgg = <input type="image" src="https://item.kakaocdn.net/do/493188dee481260d5c89790036be0e66f604e7b0e6900f9ac53a43965300eb9a" style={{border: "double", height: "80px", width:"170px"}}/> 


// 여행 스타일 선택
function Style({inputValues,setInputValues}) {
  const setSvg = (i) => {
    return(
      inputValues.style[i]? "#8C8C8C" : "#1E88E5"
    )
  }

  
  
  const styles = [
    {eng:'eating', kor:"식도락", svg:<Eating fill={setSvg(0)} className="style-icon"></Eating>},
    {eng:'market', kor:"전통시장", svg:<Eating fill={setSvg(1)} className="style-icon"></Eating>},
    {eng:'phtospot' , kor:"포토스팟", svg:<Photospot fill={setSvg(2)} className="style-icon"></Photospot>},
    {eng:'activity' , kor:"체험/액티비티", svg:<Activity fill={setSvg(3)} className="style-icon"></Activity>},
    {eng:'popular' , kor:"유명관광지", svg:<Eating fill={setSvg(4)} className="style-icon"></Eating>},
    {eng:'nature' , kor:"자연", svg:<Nature fill={setSvg(5)} className="style-icon"></Nature>},
    {eng:'relax' , kor:"여유", svg:<Eating fill={setSvg(6)} className="style-icon"></Eating>},
  ]

  // const [clicked, setClicked] = useState(inputValues.style)

  const isClicked = (i)=>{
    let newArray = [...inputValues.style]
    newArray[i] = newArray[i] * -1 + 1
    setInputValues(['style',newArray])
  }

  const setButton = (i) => {
    return(
      {
    border: inputValues.style[i]? "2px solid #8C8C8C" : "2px solid #1E88E5",
    color: inputValues.style[i]? "#8C8C8C" : "#1E88E5",
    }
  )
  }



  return (
    <div className="style-container">
      <div className="style-header">
        <div className="mention" style={{ color: "#1E88E5" }}>
          어떤 여행을 할까요?
        </div>
        <div className="mention2">취향에 맞는 일정과 장소를 추천해드려요</div>
      </div>
      <div className="style-body">
        <div className="style-title">여행 스타일~</div>
        <div className="style-select-btns">
          
          {styles.map((style,i)=>{
            return (
              <button type="button" key={i} id={style.eng} onClick={()=> isClicked(i)} style={setButton(i)}>
                {style.svg}
                <span>{style.kor}</span>
              </button> 
            )
          })}


        </div>
      </div>
    </div>
  );
}

export default Style;
