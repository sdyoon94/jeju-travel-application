import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ReactComponent as HamburgertBtn } from 'assets/hamburger-button.svg'
import { Avatar, Box, SwipeableDrawer } from '@mui/material'
import { editProfile } from "store/modules/authSlice"

function NotEdit ({ nickname, profileImg, editStart }) {
  return (
    <Box sx={{ width: "50vw", padding: 2, marginTop: 6 }}>
      <div className="drawer-profile">
        <p className="title-size drawer-profile-item">{nickname}님</p>
        <Avatar className="drawer-profile-item" alt="profile-img" src={profileImg} sx={{ width: 85, height: 85 }} />
        <span onClick={editStart}>회원정보 수정</span>
      </div>
      <hr />
      <button className="logout-btn">로그아웃</button>
    </Box>
  )
}

function EditIng ({ nickname, profileImg, handleNickname, handleProfileImg, editEnd }) {
  return (
    <Box sx={{ width: "50vw", padding: 2, marginTop: 6 }}>
      <div className="drawer-profile">
        <input type="text" className="drawer-profile-item" onChange={handleNickname} value={nickname} />
        <Avatar className="drawer-profile-item" alt="profile-img" src={profileImg} sx={{ width: 85, height: 85 }} />
        <span onClick={editEnd}>완료</span>
      </div>
      <hr />
      <button className="logout-btn">로그아웃</button>
    </Box>
  )
}


function Drawer() {
  const name = useSelector((state) => state.auth.nickname)
  const img = useSelector((state) => state.auth.profileImg)
  const dispatch = useDispatch()

  const [open, setopen] = useState(false)
  const [nickname, setNickname] = useState(name)
  const [profileImg, setProfileImg] = useState(img)
  const [edit, setEdit] = useState(false)

  const handleDrawer = (open) => function(e) {
    if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return
    }
    setopen(open)
  }

  const editStart = () => {
    setEdit(true)
  }

  const editEnd = () => {
    dispatch(editProfile(nickname, profileImg))
    setEdit(false)
  }

  const handleNickname = (e) => {
    setNickname(e.target.value)
  }

  const handleProfileImg = () => {
    setProfileImg()
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
        {
          edit
          ? <EditIng nickname={nickname} profileImg={profileImg} handleNickname={handleNickname} handleProfileImg={handleProfileImg} editEnd={editEnd} />
          : <NotEdit nickname={nickname} profileImg={profileImg} editStart={editStart} />
        }
      </SwipeableDrawer>
    </>
  );
}

export default Drawer