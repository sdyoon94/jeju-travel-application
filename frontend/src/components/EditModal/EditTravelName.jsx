// import { useState } from "react";
import { TextField } from "@mui/material";
import "globalStyle.css";
import "./EditTravelName.css";

// 여행 경비 입력
function TravelName({inputValues,setInputValues}) {
  
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
            inputProps={{ maxLength: 10, minLength: 1}}
            />
        </div>
      </div>
    </div>
    
  );
}

export default TravelName;
