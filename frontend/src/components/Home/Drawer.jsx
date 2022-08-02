import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ReactComponent as HamburgertBtn } from 'assets/hamburger-button.svg'
import { SwipeableDrawer } from '@mui/material'
import { editProfile } from "store/modules/authSlice"
import EditIng from "./Editing"
import NotEdit from "./NotEdit"


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
    dispatch(editProfile({nickname, profileImg}))
    setEdit(false)
  }
  
  const handleNickname = (e) => {
    setNickname(e.target.value)
  }
  
  const handleProfileImg = (img) => {
    setProfileImg(img)
  }
  
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      setEdit(false)
      dispatch(editProfile(nickname, edit))
    }
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
          ? <EditIng nickname={nickname} profileImg={profileImg} handleNickname={handleNickname} handleProfileImg={handleProfileImg} editEnd={editEnd} handleOnKeyPress={handleOnKeyPress} />
          : <NotEdit nickname={nickname} profileImg={profileImg} editStart={editStart} />
        }
      </SwipeableDrawer>
    </>
  );
}

export default Drawer