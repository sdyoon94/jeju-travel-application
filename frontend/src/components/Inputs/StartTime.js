import { useState } from "react";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import "globalStyle.css";
import "./StartTime.css";

// const startTimes = [
//   {
//     value: "incheon",
//     label: "인천",
//   },
//   {
//     value: "gimpo",
//     label: "김포",
//   },
// ];

// 출발지,언제,인원선택
function StartTime(props) {
  // const [startTime, setStartTime] = useState();
  // const [endTime, setEndTime] = useState();

  const handleChangeStart = (event) => {
    props.setInputValues(["startTime", event.target.value]);
  };
  const handleChangeEnd = (event) => {
    props.setInputValues(["endTime", event.target.value]);
  };

  const ExampleTextField = styled(TextField)({
    backgroundColor: "transparent",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
    },
  });

  return (
    <div className="startTime-container">
      <div className="startTime-header">
        <div className="mention">
          제주도에
          <div style={{ color: "#1E88E5", display: "inline-block" }}>
            도착하는 시간
          </div>
          과
          <div style={{ color: "#1E88E5", display: "inline-block" }}>
            떠나는 시간
          </div>
          을 알려주세요
        </div>
      </div>
      <div className="startTime-body">
        <div></div>
        <div className="input-box">
          <label className="input-label" htmlFor="select-startTime">
            여행시작
          </label>
          <ExampleTextField
            className="select-startTime"
            id="select-startTime"
            value={props.inputValues.startTime}
            type="time"
            onChange={handleChangeStart}
            InputProps={{ style: { fontSize: 20 } }}
          ></ExampleTextField>
        </div>
        <div className="input-box">
          <label className="input-label" htmlFor="select-endTime">
            여행 끝
          </label>
          <ExampleTextField
            className="select-startTime"
            id="select-endTime"
            value={props.inputValues.endTime}
            type="time"
            onChange={handleChangeEnd}
            InputProps={{ style: { fontSize: 20 } }}
          ></ExampleTextField>
        </div>
      </div>
    </div>
  );
}

export default StartTime;
