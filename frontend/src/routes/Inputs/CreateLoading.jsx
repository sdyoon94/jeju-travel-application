import { useState, useEffect,} from "react"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import './CreateLoading.css'

function CreateLoading() {
  
  const travelUid = useSelector((state) => {
    return state.inputValues.travelUid
  })
  const navigate = useNavigate()

  const [mention, setMention] = useState(`일정을 생성중이에요\n잠시만 기다려주세요`)
  
  // useEffect(()=>{
  //   if (typeof travelUid === 'number') {
  //     navigate(`/travel/${travelUid}`,{ replace: true})
    
  //   } else if (typeof travelUid === 'string') {
  //     setMention(travelUid)
    
  //   } else {
  //     return;
  //   }
  // },[travelUid])

  useEffect(() => {
    if (typeof travelUid === "string") {
      if (isNaN(travelUid)) {
        setMention(travelUid)
      
      } else if (!isNaN(travelUid)) {
        navigate(`/travel/${travelUid}`,{ replace: true})  

      }
    } else {
      return;
    }
  },[travelUid])

  return (
  
  <div className="loading">
    <div className="loading-mention text-center title-size title-weight">{mention}</div>
  </div>
  
  
  )}

export default CreateLoading