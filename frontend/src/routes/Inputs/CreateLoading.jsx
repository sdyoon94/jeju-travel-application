import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

function Loading() {
  
  const travelUid = useSelector((state) => {
    return state.inputValues.travelUid
  })
  
  useEffect()

  return (
  
  <div>
    <h1>로딩중</h1>
  </div>
  
  
  )}

export default Loading