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
      console.log(props.inputValues.periodInDays);
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
        // alertMessage = "최대 20일까지 설정 할 수 있어요";
        setAlertMessage("최대 20일까지 설정 할 수 있어요");
        console.log(alertMessage);
        // setShow((prev) => !prev);
        setShow(false);
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
        // alertMessage = "최대 20일까지 설정 할 수 있어요";
        setAlertMessage("최대 20일까지 설정 할 수 있어요");
        // setShow((prev) => !prev);
        setShow(true);
      } else {
        props.setInputValues(["periodInDays", ""]);
        // alertMessage = "최소 2일 이상 가세요";
        setAlertMessage("최소 2일 이상 가세요");
        // setShow((prev) => !prev);
        setShow(true);
      }
    }
  };

  return (
    <div className="period-container">
      <div className="period-header">
        <div className="mention" style={{ color: "#1E88E5" }}>
          얼마동안
        </div>
        <div className="mention">머무르나요?</div>
      </div>
      <div className="period-body">
        <div className="period-input">
          {show && <div className="warning">{alertMessage}</div>}
          <TextField
            id="number-period"
            name="bak"
            type="number"
            // value={props.inputValues.periodInDays}
            value={bak}
            onChange={handleChange}
            variant="filled"
          />
          <label className="input-label" htmlFor="number-period">
            박
          </label>
          <TextField
            id="number-il"
            name="il"
            type="number"
            // value={Number(props.inputValues.periodInDays) + 1}
            value={il()}
            // ref={il()}
            onChange={handleChange}
            variant="filled"
          />
          <label className="input-label" htmlFor="select-period">
            일
          </label>
        </div>

        <div className="period-body2">
          <p>
            추후에 동행자와 함께<br></br> 날짜를 정할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Period;
