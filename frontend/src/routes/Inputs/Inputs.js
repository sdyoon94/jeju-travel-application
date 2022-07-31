// import { Link } from "react-router-dom"
import * as React from "react";
import "globalStyle.css";
import "routes/Inputs/Inputs.css";
import Button from "@mui/material/Button";

import Departure from "components/Inputs/Departure";
// import Duration from "components/Inputs/Duration";
import Style from "components/Inputs/Style";
// import Budget from "components/Inputs/Budget"
// import StartTime from "components/Inputs/StartTime"
import Calender from "components/Inputs/Calender"



function Inputs() {
  // const [checked, setChecked] = React.useState(false);

  // const handleChange = () => {
  //   setChecked((prev) => !prev);
  // };

  // const handleNext = function(){
  //   setChecked((prev) => !prev);
  // }

  return (
    <div className="input-container">
      <div className="input-content">
        {/* <Departure></Departure> */}
        {/* <Duration></Duration> */}
        {/* <Style></Style> */}
        {/* <Budget></Budget> */}
        {/* <StartTime></StartTime> */}
        {/* <Style></Style> */}
        <Calender></Calender>
      </div>
      <div className="input-footer">
        <Button className="input-btn" variant="contained">
          확인
        </Button>
      </div>
    </div>
  );
}

export default Inputs;
