import React from "react";
import { useState, useRef } from "react";
import { Avatar } from "@mui/material"

function Edit() {
  const [Image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
  const fileInput = useRef(null)
  const onChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
      if(reader.readyState === 2){
        setImage(reader.result)
      }
      }
      reader.readAsDataURL(e.target.files[0])
    } else { 
      return
      }
  }
  
  
  return (
    <>
    <Avatar 
    src={Image} 
    style={{margin:'20px'}} 
    size={200} 
    onClick={()=>{fileInput.current.click()}}/>
    <input 
      type='file' 
      style={{display:'none'}}
      accept='image/*' 
      name='profile_img'
      onChange={onChange}
      ref={fileInput}/>
    </>
    


    )
  }

export default Edit

