import { useState } from "react";
import { TextField } from "@mui/material";
// import MenuItem from "@mui/material/MenuItem";
// import { styled } from "@mui/material/styles";
import "globalStyle.css";
import "./Duration.css";




// 출발지,언제,인원선택
function Duration() {
  const minDuration = 0;
  const maxDuration = 20;
  let alertMessage = ''

  const [duration, setduration] = useState();
  const handleChange = (event) => {
    if (0<= event.target.value && event.target.value <= 20) {
    setduration(event.target.value)
  } else if (event.target.value >= 20) {
    setduration(maxDuration)
    alertMessage = "최대 20일까지 설정 할 수 있어요"
    alert(alertMessage)
  }
  };

  
  


  return (
    <div className="duration-container">
      <div className="duration-header">
        <div className="mention" style={{color:"#1E88E5"}}>얼마동안</div>
        <div className="mention">머무르나요?</div>
      </div>
      <div className="duration-body">
        <div className="duration-input">
          <TextField
              id="standard-number"
              type="number"
              value={duration - 1}
              variant="filled"
            />
          <label className="input-label" for="select-duration">박</label>
          <TextField
              id="standard-number"
              type="number"
              inputProps={{ minDuration, maxDuration }}
              value={duration}
              onChange={handleChange}
              variant="filled"
            />
          <label className="input-label" for="select-duration">일</label>
        </div>
        
        <div className="duration-body2">
          <p>추후에 동행자와 함께<br></br> 날짜를 정할 수 있습니다.</p>  
        </div>
        

         
        </div>
      </div>
     
    
  );
}

export default Duration;
