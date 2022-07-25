import { useState } from "react";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import "globalStyle.css";
import "routes/Inputs.css";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

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

  return (
    <Grid className="inputs" container direction="column">
      <Grid item xs={3} container direction="column" justifyContent="flex-end">
        <p>어디서, 몇명이서</p>
        <p>떠나시나요?</p>
      </Grid>
      <Grid
        item
        xs={8}
        container
        direction="column"
        justifyContent="center"
        spacing={2}
      >
        <Grid item className="input-box">
          <label for="filled-select-currency">출발지</label>
          <TextField
            className="input"
            id="filled-select-currency"
            select
            // label="출발지"
            value={departure}
            onChange={handleChange}
            variant="standard"
          >
            {departures.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item className="input-box">
          <label for="filled-select-currency">동행자</label>
          <button onClick={incrementCount}>+</button>
          <TextField
            id="standard-number"
            type="number"
            value={count}
            variant="standard"
          />
          <button onClick={decrementCount}>-</button>
        </Grid>
      </Grid>
      <Grid item xs={1} container direction="column" justifyContent="flex-end">
        <Button className="input-btn" variant="contained">
          확인
        </Button>
      </Grid>
    </Grid>
  );
}

export default Departure;
