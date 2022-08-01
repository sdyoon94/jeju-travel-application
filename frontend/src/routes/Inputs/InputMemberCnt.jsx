// import { Link } from "react-router-dom"
import * as React from "react";
import "globalStyle.css";
import "routes/Inputs/InputCommonStyle.css";
import Button from "@mui/material/Button";

import MemberCnt from "components/Inputs/MemberCnt";



function InputMemberCnt() {
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
        <MemberCnt></MemberCnt>
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

export default InputMemberCnt;
