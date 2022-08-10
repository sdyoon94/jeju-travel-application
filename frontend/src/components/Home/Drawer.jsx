import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ReactComponent as HamburgertBtn } from 'assets/hamburger-button.svg'
import { SwipeableDrawer } from '@mui/material'
import { editNickname, editProfileImg } from "store/modules/authSlice"
import EditIng from "./Editing"
import NotEdit from "./NotEdit"


function Drawer() {
  const dispatch = useDispatch()
  const name = useSelector((state) => state.auth.nickname) || sessionStorage.getItem("nickname")
  const img = useSelector((state) => state.auth.profileImg) || sessionStorage.getItem("image_path")
  const [nickname, setNickname] = useState(name)
  const [profileImg, setProfileImg] = useState(img)
  const [open, setopen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [file, setFile] = useState(null)
  const [modify, setModify] = useState({"nickname": false, "img": false})

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
    setEdit(false)
    if (modify.nickname) {
      dispatch(editNickname(nickname))
      setModify({...modify, nickname: false})
    }
    if (modify.img) {
      dispatch(editProfileImg(file))
      setModify({...modify, img: false})
    }
  }
  
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      setEdit(false)
      if (modify.nickname) {
        dispatch(editNickname(nickname))
        setModify({...modify, nickname: false})
      }
      if (modify.img) {
        dispatch(editProfileImg(file))
        setModify({...modify, img: false})
      }
    }
  }

  const handleNickname = (e) => {
    setNickname(e.target.value)
    setModify({
      ...modify,
      "nickname": true
    })
  }

  const handleProfileImg = (img) => {
    setProfileImg(img)
    setModify({
      ...modify,
      "img": true
    })
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
          ? <EditIng nickname={nickname} profileImg={profileImg} handleNickname={handleNickname} handleProfileImg={handleProfileImg} setFile={setFile} editEnd={editEnd} handleOnKeyPress={handleOnKeyPress} />
          : <NotEdit editStart={editStart} setopen={setopen} />
        }
      </SwipeableDrawer>
    </>
  );
}

export default Drawer