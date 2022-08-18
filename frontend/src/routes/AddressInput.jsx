import { useState } from "react"
import Header from "components/Header/Header"
import DaumPostcodeEmbed from 'react-daum-postcode'
import axios from "axios"
import "./AddressInput.css"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { addSchedule } from "store/modules/travelSlice"

const KAKAO_HOST = "https://dapi.kakao.com"
const REST_API = "d6be80d86882188a8c483752bb1c2070"


function AddressInput() {
  const socket = useSelector((state) => state.socket.socket)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [inputAddress, setInputAddress] = useState("")
  const [addressName, setAddressName] = useState("")
  const { travelId, dayId } = useParams()
  const [xy, setXY] = useState({
    lat: "",
    lng: ""
  })

  const fetchXY = async(fullAddress) => {
    const response = await axios({
      method: "get",
      url: KAKAO_HOST + "/v2/local/search/address?query=" + window.encodeURIComponent(fullAddress),
      headers: {Authorization: `KakaoAK ${REST_API}`}
    })
    const lat = response.data.documents[0].y
    const lng = response.data.documents[0].x
    setXY({
      lat: lat,
      lng: lng
    })
  }

  const handleComplete = (data) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }
    setInputAddress(fullAddress)
    fetchXY(fullAddress)
  }

  const handleAddressName= (e) => {
    setAddressName(e.target.value)
  }

  const handleSubmit = () => {
    // 소켓 보내는 부분
    const payload = {
      day: dayId,
      spots: [{
        placeName: addressName,
        ...xy
      }]
    }

    socket.emit("grant schedules authority", { day: dayId }, (response) => {
      if (response.status === "ok") {
        socket.emit("create schedule", payload, (response) => {
          if (response.status === "ok") {
            dispatch(addSchedule({ dayId, selectedSpots: payload.spots}))
            socket.emit("revoke schedules authority", { day: dayId }, (_) => {})
            navigate(`/travel/${travelId}`)
            return
          }
          socket.emit("revoke schedules authority", { day: dayId }, (_) => {})
        })
      }
    })
    
    console.log(payload)
  }

  return (
    <>
      <Header style={{ margin: "3vh 4vw"}} />
      <DaumPostcodeEmbed 
        onComplete={handleComplete} 
        autoClose={false}
        style={{height: "53vh", width: "100%", padding: "10px 0"}}
      />
      {
        inputAddress
        ? <div>
            <input 
              className="address-input"
              value={addressName}
              placeholder="장소 이름을 입력하세요."
              onChange={handleAddressName} />
            <p className="content-size address-detail">{inputAddress}</p>
          </div>
        : null
      }
      <button onClick={handleSubmit} className="place-btn block" style={{margin: "5vh auto"}}>추가하기</button>
    </>
  )
}

export default AddressInput