import { useState } from "react";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import "globalStyle.css";
import "./Departure.css";



const departures = [
  {
    value: "incheon",
    label: "인천",
  },
  {
    value: "gimpo",
    label: "김포",
  },
];

// 출발지,언제,인원선택
function Departure() {
  const [departure, setDeparture] = useState('');
  const handleChangeDeparture = (event) => {
    setDeparture(event.target.value);
  };
  
  
  let [memberCnt, setMemberCnt] = useState(1);
  
  const handleChangeMemberCnt = (event) => {
    const cnt = Number(event.target.value)
    setMemberCnt(cnt);
  };


  
  function incrementCount() {
    memberCnt = memberCnt + 1;
    setMemberCnt(memberCnt);
  }
  function decrementCount() {
    memberCnt = memberCnt - 1;
    setMemberCnt(memberCnt);
  }

  const ExampleTextField = styled(TextField)({
    backgroundColor: "transparent",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none"
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none"
      }
    }
  });

  return (
    <div className="departure-container">
      <div className="departure-header">
        <div className="mention" style={{color:"#1E88E5"}}>어디서, 몇명이서</div>
        <div className="mention">떠나시나요?</div>
      </div>
      <div className="departure-body">
        <div></div>
        <label className="input-box" for="member-cnt-input">
          <label className="input-label" htmlFor="select-departure">출발지</label>
          <ExampleTextField
            className="select-departure"
            id="select-departure"
            select
            value={departure}
            onChange={handleChangeDeparture}
            InputProps={{style:{fontSize: 20}}}
          >
            {departures.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </ExampleTextField>
        </label>
        <label item className="input-box" for="member-cnt-input">
          <label className="input-label" for="member-cnt-input">인원수</label>
          <div className="control-member-cnt">
            <button className="member-cnt-btn" onClick={decrementCount}>-</button>
            <ExampleTextField
              id="member-cnt-input"
              className="member-cnt-input"
              type="number"
              value={memberCnt}
              onChange={handleChangeMemberCnt}
              // variant="standard"
              InputProps={{style:{fontSize: 20},}}
            />
            <button className="member-cnt-btn" onClick={incrementCount}>+</button>
          </div>
        </label>
      </div>
      
    </div>
  );
}

export default Departure;
