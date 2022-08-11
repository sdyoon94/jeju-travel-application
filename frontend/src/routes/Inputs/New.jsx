// import { Link } from "react-router-dom"
// import * as React from "react";
import { useState,useEffect } from "react";

import "globalStyle.css";
import "routes/Inputs/NewCommon.css";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import Gamgyul from "components/Header/Gamgyul"


import MemberCnt from "components/Inputs/MemberCnt";
import Budget from "components/Inputs/Budget";
import Style from "components/Inputs/Style";
import Date from "components/Inputs/Dates";
import Period from "components/Inputs/Period";
import Time from "components/Inputs/StartTime";

import { useSelector, useDispatch } from "react-redux";
import { setInputValues, resetInputValues } from "store/modules/inputValuesSlice";
import { createTravel } from "store/modules/inputValuesSlice";


function New() {

  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  useEffect(() => {
    setScreenSize();
  });

  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const inputValues = useSelector((state) => {
    return state.inputValues;
  });

  const inputForms = {
    membercnt: (
      <MemberCnt
        inputValues={inputValues}
        setInputValues={(props) => {
          dispatch(setInputValues(props));
        }}
      ></MemberCnt>
    ),
    date: (
      <Date
        inputValues={inputValues}
        setInputValues={(props) => {
          dispatch(setInputValues(props));
        }}
      ></Date>
    ),
    period: (
      <Period
        inputValues={inputValues}
        setInputValues={(props) => {
          dispatch(setInputValues(props));
        }}
      ></Period>
    ),
    style: (
      <Style
        inputValues={inputValues}
        setInputValues={(props) => {
          dispatch(setInputValues(props));
        }}
      ></Style>
    ),
    budget: (
      <Budget
        inputValues={inputValues}
        setInputValues={(props) => {
          dispatch(setInputValues(props));
        }}
      ></Budget>
    ),
    time: (
      <Time
        inputValues={inputValues}
        setInputValues={(props) => {
          dispatch(setInputValues(props));
        }}
      ></Time>
    ),
  };

  const navigate = useNavigate();
  const params = useParams();
  const form = inputForms[params.input];

  const nextRoute = function () {
    if (params.input === "membercnt" && inputValues.maxMemberCnt >= 2) {
      setShow(false);
      navigate("/new/period");
    } else if (params.input === "membercnt" && inputValues.maxMemberCnt == 1) {
      setShow(false);
      navigate("/new/date");
    } else if (inputValues.maxMemberCnt === "") {
      setShow(true);
    } else if (params.input === "period" || params.input === "date") {
      if (inputValues.periodInDays === "") {
        setShow(true);
      } else {
        setShow(false);
        navigate("/new/style");
      }
    } else if (params.input === "style") {
      if (inputValues.style == [0, 0, 0, 0, 0, 0, 0].toString()) {
        setShow(true);
      } else {
        setShow(false);
        navigate("/new/budget");
      }
    } else if (params.input === "budget") {
      if (inputValues.budget === "") {
        setShow(true);
      } else {
        setShow(false);
        navigate("/new/time");
      }
    } else if (params.input === "time") {
      if (inputValues.startTime === "" || inputValues.endTime === "") {
        setShow(true);
      } else {
        setShow(false);

        navigate('/loading', {replace:true})
        dispatch(createTravel("123"));
        console.log("next");
        dispatch(resetInputValues())
        console.log("state리셋")
      }
    }
  };

  // const saveAndNext = function (event) {
  //   event.preventDefault();

  //   const route = "/new/" + nextRoute();
  //   navigate(route);
  // };

  useEffect(() => {
    navigate("/new/membercnt");
  }, []);

  return (
    <div className="input-container">
      <div className="input-content">
        <Gamgyul />
        {form}
      </div>
      <div className="input-footer">
        <Button className="input-btn" variant="contained" onClick={nextRoute}>
          다음
        </Button>
      </div>
      {show && <div className="warning">필수 입력 값이에요 모두 입력 해주세요</div>}
    </div>
  );
}

export default New;
