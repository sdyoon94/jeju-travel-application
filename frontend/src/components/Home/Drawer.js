import { useState } from 'react'
import { ReactComponent as HamburgertBtn } from 'assets/hamburger-button.svg'
import { Avatar, Box, SwipeableDrawer } from '@mui/material'
import "globalStyle.css"
import "routes/Home.css"



function Drawer() {
  const [open, setopen] = useState(false)

  const handleDrawer = (open) => function(e) {
    if (
      e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')
      ) {
        return
      }
      setopen(open)
  }


  return (
    <>
      <HamburgertBtn className="hamburger-icon" onClick={handleDrawer(true)} />
      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={handleDrawer(true)}
        onClose={handleDrawer(false)}
        >
        <Box sx={{ width: 200, padding: 2, marginTop: 6 }}>
          <div className="drawer-profile">
            <h3 className="subtitle-size">유저네임</h3>
            <Avatar className="drawer-profile-item" alt="profile-img" src="icons/personIcon.png" sx={{ width: 35, height: 35 }} />
          </div>
            <h3 className="subtitle-size inline-block">내 여행 <span className="color-1">1</span></h3>
          <hr />
          <h3 className="subtitle-size">회원정보</h3>
          <div className="drawer-profile">
            <span className="content-size">이메일</span>
            <span className="content-size">xxx@google.com</span>
          </div>
          <button className="user-edit-btn">회원정보 수정</button>
          <hr />
          <button className="logout-btn">로그아웃</button>


        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default Drawer