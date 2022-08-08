// import { Link } from "react-router-dom"
import * as React from "react";
import "globalStyle.css";
import "routes/Inputs/NewCommon.css";
import Button from "@mui/material/Button";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import MemberCnt from "components/Inputs/MemberCnt";
import Budget from "components/Inputs/Budget";
import Style from "components/Inputs/Style";
import Date from "components/Inputs/Dates";
import Period from "components/Inputs/Period";
import Time from "components/Inputs/StartTime";

import { useSelector, useDispatch } from "react-redux";
import { setInputValues, createTravel } from "store/modules/inputValuesSlice";

import { useState } from "react";

function New() {
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
      if (inputValues.style == [1, 1, 1, 1, 1, 1, 1].toString()) {
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

        // navigate('/loading')
        dispatch(createTravel());
        console.log("next");
      }
    }
  };

  // const saveAndNext = function (event) {
  //   event.preventDefault();

  //   const route = "/new/" + nextRoute();
  //   navigate(route);
  // };

  React.useEffect(() => {
    if (inputValues.maxMemberCnt === "") {
      navigate("/new/membercnt");
    }
  }, []);

  return (
    <div className="input-container">
      <div className="input-content">{form}</div>
      <div className="input-footer">
        <Button className="input-btn" variant="contained" onClick={nextRoute}>
          확인
        </Button>
      </div>
      {show && <div className="warning">입력값 다 넣으세요</div>}
    </div>
  );
}

export default New;
