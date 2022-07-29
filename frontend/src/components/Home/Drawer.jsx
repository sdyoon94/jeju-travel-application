import { useState } from "react"
// import { useSelector } from "react-redux"
import { ReactComponent as HamburgertBtn } from 'assets/hamburger-button.svg'
import { Avatar, Box, SwipeableDrawer } from '@mui/material'




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

  // const userInfo = useSelector((state) => console.log(state))


  return (
    <>
      <HamburgertBtn className="hamburger-icon" onClick={handleDrawer(true)} />
      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={handleDrawer(true)}
        onClose={handleDrawer(false)}
        >
        <Box sx={{ width: "50vw", padding: 2, marginTop: 6 }}>
          <div className="drawer-profile">
            <p className="title-size">유저네임</p>
            <Avatar className="drawer-profile-item" alt="profile-img" src="icons/gamgyul.jpg" sx={{ width: 35, height: 35 }} />
          </div>
            <p className="subtitle-size inline-block">내 여행 <span className="color-1">1</span></p>
          <hr />
          <p className="subtitle-size">회원정보</p>
          <div className="drawer-profile">
            <span className="content-size">이메일</span>
            <span className="content-size">xxx@google.com</span>
          </div>
          <p className="subcontent-size user-edit">회원정보 수정</p>
          <hr />
          <button className="logout-btn">로그아웃</button>


        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default Drawer