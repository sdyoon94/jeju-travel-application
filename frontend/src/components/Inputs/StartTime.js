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

  // const ExampleTextField = styled(TextField)({
  //   backgroundColor: "transparent",
  //   "& .MuiOutlinedInput-notchedOutline": {
  //     border: "none",
  //   },
  //   "&.Mui-focused": {
  //     "& .MuiOutlinedInput-notchedOutline": {
  //       border: "none",
  //     },
  //   },
  // });

  return (
    <div className="startTime-container">
      <div className="startTime-header">
        <div className="inline-block subcontentfont-weight title-size " >
          <span>전체일정의 </span>
          <span className="color-1">시작시간</span>
          <span>과</span>
        </div>
        <div className=" subcontentfont-weight title-size ">
          <span className="color-1"> 끝나는 시간</span>
          <span>을 알려주세요</span>
        </div>

        {/* <div className="inline-block subcontentfont-weight title-size " >
          <span>제주도에 </span>
          <span className="color-1">도착하는 시간,</span>
        </div>
        <div className=" subcontentfont-weight title-size ">
        <span>제주도를 </span>
        <span className="color-1">떠나는 시간</span>
        <span>을 </span>
        </div>
        <div className=" subcontentfont-weight title-size ">
          <span>알려주세요</span>
        </div> */}
      

      </div>
      
      <div className="startTime-body">
        <div className="time-input-box">
          <label className="input-label" htmlFor="select-startTime">
            시작시간
          </label>
          <TextField
            className="select-startTime"
            id="select-startTime"
            value={props.inputValues.startTime}
            type="time"
            onChange={handleChangeStart}
            variant="standard"
            InputProps={{ style: { fontSize: 20 } }}
            
            sx={{
              "& .MuiInputBase-root": {
                  "& input": {
                      textAlign: "center"
                  }
              }
            }}
          ></TextField>
        </div>
        <div className="time-input-box">
          <label className="input-label" htmlFor="select-endTime">
            끝 시간
          </label>
          <TextField
            className="select-startTime"
            id="select-endTime"
            value={props.inputValues.endTime}
            type="time"
            onChange={handleChangeEnd}
            variant="standard"
            InputProps={{ style: { fontSize: 20 } }}
            sx={{
              "& .MuiInputBase-root": {
                  "& input": {
                      textAlign: "center"
                  }
              }
            }}
          ></TextField>
        </div>
      </div>
    </div>
  );
}

export default StartTime;
