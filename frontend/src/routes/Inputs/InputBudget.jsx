import * as React from "react"
import "globalStyle.css"
import "routes/Inputs/InputCommonStyle.css"
import Button from "@mui/material/Button"
import Budget from "components/Inputs/Budget"

function InputBudget() {
  return (
    <div className="input-container">
      <div className="input-content">
        {/* <Departure></Departure> */}
        {/* <Duration></Duration> */}
        {/* <Style></Style> */}
        <Budget></Budget>
        {/* <StartTime></StartTime> */}
        {/* <Style></Style> */}
        {/* <Calender></Calender> */}
      </div>
      <div className="input-footer">
        <Button className="input-btn" variant="contained">
          확인
        </Button>
      </div>
    </div>
  );
}

export default InputBudget;