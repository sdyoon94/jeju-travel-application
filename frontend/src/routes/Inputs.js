// import { Link } from "react-router-dom"
import * as React from 'react';
import Button from '@mui/material/Button';
import "globalStyle.css"
import "routes/Inputs.css"
import Departure from "components/Inputs/Departure"

// import Box from '@mui/material/Box';
// import Switch from '@mui/material/Switch';
// import Paper from '@mui/material/Paper';
// import Slide from '@mui/material/Slide';
// import FormControlLabel from '@mui/material/FormControlLabel';







// 입력 전체


function Inputs() {
  // const [checked, setChecked] = React.useState(false);

  // const handleChange = () => {
  //   setChecked((prev) => !prev);
  // };

  // const handleNext = function(){
  //   setChecked((prev) => !prev);
  // }

  return (
    <div className="inputs">
      <Departure></Departure>
      <Button className="input-btn" variant="contained">확인</Button>
    
    </div>
    
    
    // <Box >
    //   <Box >
    //     <FormControlLabel
    //       control={<Switch checked={checked} onChange={handleChange} />}
    //       label="Show"
    //     />
    //     <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
    //       {content}
    //     </Slide>
    //     <button className="auth-btn" onClick={handleNext}>로그인</button>

    //   </Box>
    // </Box>
    
  )
}


export default Inputs