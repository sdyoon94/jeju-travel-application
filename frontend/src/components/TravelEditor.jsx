import { CircularProgress } from "@mui/material"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"

const WS_HOST = "ws://i7a609.p.ssafy.io:8081"

// default event - "connect", "disconnect", "connect_error" 이벤트를 핸들링
const handleConnection = (socket, state, setState, navigate) => {
  // WS 서버에 연결됐을 때
  socket.on("connect", () => {
    console.log(`connected to ${WS_HOST} server`)
    setState({
      ...state, 
      isConnected: true
    })
  })

  // WS 서버와 연결이 종료되었을 때
  socket.on("disconnect", (reason) => {
    console.log(`disconnected to ${WS_HOST} server(${reason})`)
    setState({
      ...state,
      isConnected: false
    })

    /* 발생 가능한 reason (에러의 이유)
    switch(reason) {
      case "io client disconnect":
        break
      case "io server disconnect":
        break
      case "ping timeout":
        break
      case "transport close":
        break
      case "transport error":
        break
      default:
        break
    }
    */
  })

  // WS 서버와의 연결에서 에러가 발생했을 때 - 메인 페이지로 리다이렉트
  socket.on("connect_error", (err) => {
    alert(err)
    navigate("/", { replace: true })
  })
}

// user-defined event - WS 서버에서 브로드캐스팅된 이벤트를 핸들링
const handleListen = (socket) => socket

// user-defined emit - WS 서버에 전송할 메시지를 핸들링
const handleEmit = (socket) => socket

function TravelEditor({ tripId }) {

  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)

  const [ state, setState ] = useState({
    isConnected: false
  })

  const socket = io(WS_HOST, {
    auth: {
      token
    },
    query: {
      tripId
    }
  })

  handleConnection(socket, state, setState, navigate)

  return (
    <>
      { 
      state.isConnected ?
        null :
        <div className="travel-editor-container">
          <div className="text-center">
            <CircularProgress /><br />
            <span className="travel-editor-message">
                실시간 서버에 연결중입니다...
            </span>
          </div>
        </div>
      }
    </>
  )
}

export default TravelEditor