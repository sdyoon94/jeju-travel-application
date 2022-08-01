// import { Link } from "react-router-dom"
import * as React from "react";
import "globalStyle.css";
import "routes/Inputs/InputCommonStyle.css";
import Button from "@mui/material/Button";

// import Duration from "components/Inputs/Duration";
// import Style from "components/Inputs/Style";
import Budget from "components/Inputs/Budget";
import { Outlet } from "react-router-dom";
// import StartTime from "components/Inputs/StartTime"
// import Calender from "components/Inputs/Calender";

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
        <Outlet />
        {/* <Departure></Departure> */}
        {/* <Duration></Duration> */}
        {/* <Style></Style> */}
        {/* <Budget></Budget> */}
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

export default Inputs;
