import { useState } from "react";
import { TextField } from "@mui/material";
import "globalStyle.css";
import "./Budget.css";

// 여행 경비 입력
function Budget(props) {
  const [show, setShow] = useState(false);

  const handleChange = (event) => {
    if (0 <= event.target.value && event.target.value <= 9999) {
      props.setInputValues(["budget", event.target.value]);
      setShow(false);
    } else if (event.target.value >= 10000) {
      props.setInputValues(["budget", "9999"]);
      setShow(true);
    }
  };

  return (
    <div className="budget-container">
      <div className="budget-header">
      <div className="inline-block subcontentfont-weight title-size" >
          <span>여행의 </span>
          <span className="color-1">경비</span>
          <span>는 얼마인가요?</span>
        </div>
        <div className="subcontentfont-weight content-size text-center gray">항공권과 이동수단은 비용에서 제외 해주세요</div>
      </div>
      <div className="budget-body">
        <div className="budget-input">        
            <TextField
              autoFocus
              id="number-duration"
              name="bak"
              type="number"
              value={props.inputValues.budget}
              onChange={handleChange}
              variant="standard"
              InputProps={{style:{fontSize: 20, textAlign: "center"}}}
              sx={{
              "& .MuiInputBase-root": {
                  "& input": {
                      textAlign: "center"
                  }
              }
            }}
            />
            <label className="input-label" htmlFor="number-duration">
              만원
            </label>
        </div>
        {show && <div className="warning2">경비는 최대 9999만원이에요</div>}
      </div>
    </div>
    
  );
}

export default Budget;
