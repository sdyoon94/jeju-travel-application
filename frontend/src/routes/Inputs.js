// import { Link } from "react-router-dom"
import "../globalStyle.css"
import "./Signup.css"
import * as React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import FormControlLabel from '@mui/material/FormControlLabel';


// 출발지,언제,인원선택
function Departure(){
  return(
    <h1>출발지,언제,인원선택</h1>

  )
}

// 여행 일정 선택
function Schedule(){
  return(
    <h1>여행일정선택</h1>

  )
}

// 여행 스타일 선택
function Style(){
  return(
    <h1>여행스타일선택</h1>

  )
}

// 여행 경비 입력
function Budget(){
  return(
    <h1>여행경비선택</h1>
  )
}

// 시작 시간 입력
function StartTime(){
  return(
    <div className="center">
      <h2 className="login-top">시작시간</h2>
      <form>
        <label htmlFor="email" className="block">이메일</label>
        <input id="email" type="email" className="input-auth" />
        <label htmlFor="password" className="block">비밀번호</label>
        <input id="password" type="password" className="input-auth" />
        <div>
        <input type="checkbox" id="onLogin" className="input-checkbox"/>
        <label htmlFor="onLogin">로그인 유지하기</label>
        </div>
        
      </form>
      
    </div>
  )
}


// 입력 전체


// const icon = (
//   <Paper sx={{ m: 1 }} elevation={4}>
//     <Box component="svg" sx={{ width: 100, height: 100 }}>
//       <Box
//         component="polygon"
//         sx={{
//           fill: (theme) => theme.palette.common.white,
//           stroke: (theme) => theme.palette.divider,
//           strokeWidth: 1,
//         }}
//         points="0,100 50,00, 100,100"
//       />
//     </Box>
//   </Paper>
//   <form action="">
//     <input type="text" />
//   </form>
// );

let content = StartTime()

function Inputs() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const handleNext = function(){
    setChecked((prev) => !prev);
  }

  return (
    <div>
    {/* <Box sx={{ height: 180 }}>
      <Box sx={{ width: `calc(100px + 16px)` }}> */}
    <Box >
      <Box >
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} />}
          label="Show"
        />
        <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
          {content}
        </Slide>
        <button className="auth-btn" onClick={handleNext}>로그인</button>

      </Box>
    </Box>
    </div>
  )
}


export default Inputs