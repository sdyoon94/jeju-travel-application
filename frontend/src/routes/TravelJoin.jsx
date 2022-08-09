import { CircularProgress } from "@mui/material";
import { useState } from "react"
import { useSelector } from "react-redux"
import "./TravelJoin.css"
import "../globalStyle.css"


const { useParams, useNavigate } = require("react-router-dom");

const URL = "http://i7a609.p.ssafy.io:8081/oauth2/authorization/kakao"

function TravelJoin() {

  const navigate = useNavigate()
  const { travelUid } = useParams()
  const { id } = useSelector((state) => state.auth)


  const isLoggedIn = id ? true : false

  const [ title, setTitle ] = useState("여행 제목")
  
  /* 비동기 통신 - 여행 메타 정보 받아오는 부분

  const [ isLoaded, setIsLoaded ] = useState(false)
  try {
    const resp = axios({
      method: "get",
      url: `~/join/${travelUid}/meta`
    })
    setTitle(resp.data.title)
    setIsLoaded(true)
  }
  catch (err) {
    alert("여행 메타 정보를 불러오는 데 문제가 발생하였습니다. ")
    navigate("/", {
      replace: true
    })
  }
   */ 

  // 홈으로 가기 클릭 시 동작
  const handleHomeClick = () => {
    navigate("/", {
      replace: false
    })
  }


  // 참여하기 클릭 시 동작
  const handleJoinClick = async () => {
    /* 
    try {
      const resp = await axios({
        method: "get",
        url: `~/join/${travelUid}`
      })
      // 메인 페이지로 보내거나, 바로 여행에 참여시키거나
      navigate("/", {
        replace: true
      })
    }
    catch (err) {
      alert("현재 여행 참여가 어려운 상황입니다. ")
    }
    */
  }


  return (
    <div className="travel-join-container" >
      {/* { isLoaded ? 
        <div className="travel-join-title">
          { title }에 초대되었습니다. <br />
          여행에 참여하시겠어요?
        </div> :
        <CircularProgress />
      } */}
      <div className="travel-join-title subtitle-size">
        <p>{ title }에 초대되었습니다.</p>
        <p>같이 제주도로 떠날까요?</p>
      </div>
      <div className="travel-join-body">
        { isLoggedIn ? 
          <>
            <button onClick={handleJoinClick} className="travel-join-btn">
              참여하기
            </button> 
            <span onClick={handleHomeClick} className="subcontent-size">
              홈으로 가기
            </span>
          
          </>
          : 
          <>
            <a href={URL} style={{height: "12vw"}}>
              <img className="kakao-box" alt="kakaoLoginBtn" src="/icons/kakaoLogo.png"></img>
            </a>
            <span>로그인 후 이용할 수 있는 서비스입니다. </span>
          </>
        }
      </div>
    </div>
  )

}

export default TravelJoin