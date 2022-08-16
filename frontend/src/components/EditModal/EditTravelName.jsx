// import { useState } from "react";
import { TextField } from "@mui/material";
import "globalStyle.css";
import "./EditTravelName.css";

// 여행 경비 입력
function TravelName({inputValues,setInputValues}) {
  // const [show, setShow] = useState(false);

  // const handleChange = (event) => {
  //   if (0 <= event.target.value && event.target.value <= 9999) {
  //     props.setInputValues(["title", event.target.value]);
  //     setShow(false);
  //   } else if (event.target.value >= 10000) {
  //     props.setInputValues(["title", "9999"]);
  //     setShow(true);
  //   }
  // };

  const handleChange = (event) => {
    setInputValues(['tripName',event.target.value])
  }

  return (
    <div className="travel-name-container">
      <div className="travel-name-header">
      <div className="inline-block subtitle-size subcontentfont-weight" >
          <span>여행 </span>
          <span className="color-1">제목 </span>
          <span>수정</span>
        </div>
        <div className="subcontentfont-weight subcontent-size text-center gray">일행의 여행 제목도 함께 수정 됩니다</div>
      </div>
      <div className="travel-name-body">
        <div className="travel-name-input">        
            <TextField
              id="travel-name"
              type="text"
              value={inputValues.tripName}
              // inputProps={{ minDuration, maxDuration }}
              onChange={handleChange}
              variant="standard"
              InputProps={{style:{fontSize: 15, textAlign: "center"}}}
              sx={{
              "& .MuiInputBase-root": {
                  "& input": {
                      textAlign: "center"
                  }
              }
            }}
            inputProps={{ maxLength: 10 }}
            />
            {/* <label className="input-label" htmlFor="number-duration">
              만원
            </label> */}
        </div>
      </div>
    </div>
    
  );
}

export default TravelName;
