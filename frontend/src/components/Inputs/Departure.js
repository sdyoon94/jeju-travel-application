import {useState} from 'react'
import { TextField } from "@mui/material"
import MenuItem from '@mui/material/MenuItem'
import 'globalStyle.css' 
import 'routes/Inputs.css'

const departures = [
  {
    value:'incheon',
    label:'인천',
  },
  {
    value:'gimpo',
    label:'김포',
  },
]

// 출발지,언제,인원선택
function Departure(){
  const [departure, setDeparture] = useState();

  const handleChange = (event) => {
    setDeparture(event.target.value);
  };


  return(
  <div>
    <h1>출발지,언제,인원선택</h1>
    <p>어디서, 몇명이서</p>
    <p>떠나시나요?</p>
    <TextField
          className="input"
          id="filled-select-currency"
          select
          label="Select"
          value={departure}
          onChange={handleChange}
          variant="filled"
        > 
        {departures.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
        </TextField>
  </div>
  )
}

export default Departure