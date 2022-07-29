import { useState } from "react";
import { TextField } from "@mui/material";
// import MenuItem from "@mui/material/MenuItem";
// import { styled } from "@mui/material/styles";
import "globalStyle.css";
import "./Duration.css";

// 출발지,언제,인원선택
function Duration() {
  const [show, setShow] = useState(false);

  let alertMessage = "";

  const [durations, setDurations] = useState({
    bak: null,
    il: null,
  });

  const { bak, il } = durations;

  const handleChange = (event) => {
    
    const { name, value } = event.target;
    if (name === "bak") {
      if (0 <= value && value <= 19) {
        setDurations({
          ...durations,
          [name]: value,
          ["il"]: Number(value) + 1,
        });
      } else if (value > 19) {
        setDurations({
          ...durations,
          [name]: 19,
          ["il"]: 20,
        });
        alertMessage = "최대 20일까지 설정 할 수 있어요";
        setShow((prev) => !prev);
      }
    }
    if (name === "il") {
      if (0 <= value && value <= 20) {
        setDurations({
          ...durations,
          [name]: value,
          ["bak"]: Number(value) - 1,
        });
      } else if (value > 20) {
        setDurations({
          ...durations,
          [name]: 20,
          ["bak"]: 19,
        });
        alertMessage = "최대 20일까지 설정 할 수 있어요";
        setShow((prev) => !prev);
        // alert(alertMessage);
      }
    }
  };

  return (
    <div className="duration-container">
      <div className="duration-header">
        <div className="mention" style={{ color: "#1E88E5" }}>
          얼마동안
        </div>
        <div className="mention">머무르나요?</div>
      </div>
      <div className="duration-body">
        <div className="duration-input">
          {show && (
            <div className="warning">
              여행일정은 최대 20일까지 설정 가능해요
            </div>
          )}
          <TextField
            id="number-duration"
            name="bak"
            type="number"
            value={bak}
            // inputProps={{ minDuration, maxDuration }}
            onChange={handleChange}
            variant="filled"
          />
          <label className="input-label" for="number-duration">
            박
          </label>
          <TextField
            id="number-il"
            name="il"
            type="number"
            value={il}
            // inputProps={{ minDuration, maxDuration }}
            onChange={handleChange}
            variant="filled"
          />
          <label className="input-label" for="select-duration">
            일
          </label>
        </div>

        <div className="duration-body2">
          <p>
            추후에 동행자와 함께<br></br> 날짜를 정할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Duration;
