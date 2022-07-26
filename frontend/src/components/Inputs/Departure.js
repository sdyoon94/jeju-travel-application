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
  const [departure, setDeparture] = useState("출발지");
  const handleChange = (event) => {
    setDeparture(event.target.value);
  };

  let [count, setCount] = useState(1);
  function incrementCount() {
    count = count + 1;
    setCount(count);
  }
  function decrementCount() {
    count = count - 1;
    setCount(count);
  }

  const ExampleTextField = styled(TextField)({
    backgroundColor: "#eee",
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
      <div className="departure-inputs">
        <div></div>
        <div className="input-box">
          <label className="input-label" for="select-departure">출발지</label>
          <ExampleTextField
            className="select-departure"
            id="select-departure"
            select
            value={departure}
            onChange={handleChange}
            variant="standard"
          >
            {departures.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </ExampleTextField>
        </div>
        <div item className="input-box">
          <label className="input-label" for="filled-select-currency">동행자</label>
          <div>
            <button onClick={incrementCount}>+</button>
            <TextField
              id="standard-number"
              type="number"
              value={count}
              // variant="filled"
            />
            <button onClick={decrementCount}>-</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Departure;
