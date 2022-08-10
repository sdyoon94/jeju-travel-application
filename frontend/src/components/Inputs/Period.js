import { useState } from "react";
import { TextField } from "@mui/material";
// import MenuItem from "@mui/material/MenuItem";
// import { styled } from "@mui/material/styles";
import "globalStyle.css";
import "./Period.css";

// 출발지,언제,인원선택
function Period(props) {
  const [show, setShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // let alertMessage = "";

  const bak = props.inputValues.periodInDays;
  const il = () => {
    if (props.inputValues.periodInDays) {
      return Number(props.inputValues.periodInDays) + 1;
    } else {
      return "";
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "bak") {
      if (0 <= value && value <= 19) {
        props.setInputValues(["periodInDays", event.target.value]);
        setShow(true);
      } else if (value > 19) {
        props.setInputValues(["periodInDays", "19"]);
        setAlertMessage("최대 20일까지 설정 할 수 있어요");
        setShow(true);
      } else if (value === "") {
        props.setInputValues(["periodInDays", null]);
        setShow(false);
      }
    }
    if (name === "il") {
      if (2 <= value && value <= 20) {
        const periodInDays = String(Number(event.target.value) - 1);
        props.setInputValues(["periodInDays", periodInDays]);
        setShow(false);
      } else if (value > 20) {
        props.setInputValues(["periodInDays", "19"]);
        setAlertMessage("최대 20일까지 설정 할 수 있어요");
        setShow(true);
      } else {
        props.setInputValues(["periodInDays", ""]);
        setAlertMessage("최소 2일 이상 가세요");
        setShow(true);
      }
    }
  };

  return (
    <div className="period-container">
      <div className="period-header">
        <div className="inline-block subcontentfont-weight title-size" >
          <span>여행 </span>
          <span className="color-1">기간 </span>
          <span>정하기</span>
        </div>
        <div className="subcontentfont-weight content-size text-center gray">추후에 동행자와 함꼐 날짜를 정할 수 있어요</div>
      </div>
      <div className="period-body">
        <div className="period-input">
          {show && <div className="warning2">{alertMessage}</div>}
          <TextField
            id="number-period"
            name="bak"
            type="number"
            value={bak}
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
          <label className="input-label" htmlFor="number-period">
            박
          </label>
          <TextField
            id="number-il"
            name="il"
            type="number"
            value={il()}
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
          <label className="input-label" htmlFor="select-period">
            일
          </label>
        </div>

        {/* <div className="period-body2">
          <p className="body2-ment">
            추후에 동행자와 함께<br></br> 날짜를 정할 수 있습니다.
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default Period;
