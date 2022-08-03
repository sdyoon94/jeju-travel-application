import { useState } from "react"
import { useRef } from "react"
import { Avatar, Box } from "@mui/material"



function EditIng ({ nickname, profileImg, handleNickname, handleProfileImg, setFile, editEnd, handleOnKeyPress }) {
  const fileInput = useRef(null)


  const onChange = (e) => {
    const img = e.target.files[0]
    if (img) {
      const reader = new FileReader()
      const formData = new FormData()
      formData.append("file", img)
      // for (const keyValue of formData) console.log('11', keyValue)
      reader.onload = () => {
      if(reader.readyState === 2){
        handleProfileImg(reader.result)
        setFile(formData)
      }
      }
      reader.readAsDataURL(img)
    } else { 
      return
      }
  }

  return (
    <Box sx={{ width: "50vw", padding: 2, marginTop: 6 }}>
      <div className="drawer-profile">
        <input autoFocus type="text" className="drawer-profile-item" onChange={handleNickname} value={nickname} onKeyDown={handleOnKeyPress} />
        <Avatar 
          src={profileImg} 
          alt="profile-img" 
          sx={{ width: 85, height: 85 }}
          onClick={()=>{fileInput.current.click()}} />
        <input 
          type='file' 
          style={{display:'none'}}
          accept='image/*' 
          name='profile_img'
          onChange={onChange}
          ref={fileInput}/>
        <span onClick={editEnd}>완료</span>
      </div>
      <hr />
      <button className="logout-btn">로그아웃</button>
    </Box>
  )
}

export default EditIng