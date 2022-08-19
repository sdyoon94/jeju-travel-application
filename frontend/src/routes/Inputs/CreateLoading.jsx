import { useState, useEffect,} from "react"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import './CreateLoading.css'

function CreateLoading() {
  
  const travelUid = useSelector((state) => {
    return state.inputValues.travelUid
  })
  const navigate = useNavigate()

  const [mention, setMention] = useState("즐거운 여행이 됐으면 좋겠어요!")

  useEffect(() => {
    if (typeof travelUid === "string") {
      if (!isNaN(travelUid)) {
        navigate(`/travel/${travelUid}`,{ replace: true})  
      }
    } else {
      return;
    }
  // eslint-disable-next-line
  },[travelUid])

  return (
  
  <div className="loading">
    <div className="loading-mention text-center title-size title-weight">{mention}</div>
  </div>
  
  
  )}

export default CreateLoading