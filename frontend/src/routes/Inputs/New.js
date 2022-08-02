// import { Link } from "react-router-dom"
import * as React from "react";
import "globalStyle.css";
import "routes/Inputs/NewCommon.css";
import Button from "@mui/material/Button";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import MemberCnt from "components/Inputs/MemberCnt";
import Budget from "components/Inputs/Budget";
import Style from "components/Inputs/Style"
import Date from "components/Inputs/Calender"
import Period from "components/Inputs/Duration"
import Time from "components/Inputs/StartTime";

import { useSelector, useDispatch } from "react-redux";
import { setInputValues } from "store/modules/inputValuesSlice"







function New() { 

  const dispatch = useDispatch()
  const inputValues = useSelector(state=>{
    
    return state.inputValues
  })

  const inputForms = {
    'membercnt': <MemberCnt inputValues={inputValues} setInputValues={(props)=>{dispatch(setInputValues(props))}} ></MemberCnt>,
    'date':<Date></Date>,
    'period':<Period></Period>,
    'style':<Style></Style>,
    'budget': <Budget></Budget>,
    'time':<Time></Time>,
  }





  const navigate = useNavigate()
  const params = useParams()
  const form = inputForms[params.input]
  
  const nextRoute = function (){
    if(params.input == 'membercnt' && (inputValues.maxMemberCnt >= 2)) {
      return "period"
    } else if (params.input === 'membercnt' && (inputValues.maxMemberCnt === 1)) {
      return "date"  
    } else if (params.input === 'period' || params.input == 'date') {
      return "style"
    } else if (params.input === 'style') {
      return "budget"
    } else if (params.input === 'budget') {
      return "time"
    } else if (params.input === 'time') {
      return ""
    }}


  const saveAndNext = function(event) {
    event.preventDefault()
    console.log(inputValues)
    console.log(inputValues.inputValues)

    // console.log(nextRoute())
    const route = "/new/" + nextRoute()
    navigate(route)
  }
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
        {form}
        {form.memberCnt}
      </div>
      <div className="input-footer">
        <Button className="input-btn" variant="contained" onClick={saveAndNext}>
          확인
        </Button>
      </div>
    </div>
  );
}

export default New;
