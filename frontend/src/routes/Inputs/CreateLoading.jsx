import { useState, useEffect,} from "react"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"

function CreateLoading() {
  
  const travelUid = useSelector((state) => {
    return state.inputValues.travelUid
  })
  const navigate = useNavigate()
  
  useEffect(()=>{
    navigate(`/travel/${travelUid}`)
  },[travelUid])

  return (
  
  <div>
    <h1>로딩중</h1>
  </div>
  
  
  )}

export default CreateLoading