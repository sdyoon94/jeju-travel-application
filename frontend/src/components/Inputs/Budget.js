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
        <div className="mention">
          이번 여행의{" "}
          <div style={{ color: "#1E88E5", display: "inline-block" }}>
            예상 경비
          </div>
          를 말해주세요
        </div>
        <div className="mention2">항공권과 이동수단 비용은 제외해주세요</div>
      </div>
      <div className="budget-body">
        <div className="budget-input">
          <div>여행경비</div>
          <div className="budget-input-body">
            <TextField
              id="number-duration"
              name="bak"
              type="number"
              value={props.inputValues.budget}
              // inputProps={{ minDuration, maxDuration }}
              onChange={handleChange}
              variant="filled"
            />
            <label className="input-label" htmlFor="number-duration">
              만원
            </label>
          </div>
        </div>
        {show && <div className="warning">경비는 최대 9999만원이에요</div>}
      </div>
    </div>
    
  );
}

export default Budget;
