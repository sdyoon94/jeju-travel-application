import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { login, setToken } from "store/modules/authSlice"
import jwt_decode from "jwt-decode"
import axios from "axios"
import { useSelector } from "react-redux"
import { pollInvited } from "store/modules/travelJoinSlice"

function KakaoRedirect() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const href = window.location.href
  const params = new URL(href).searchParams
  const accessToken = params.get("token")

  const inviteInfo = JSON.parse(sessionStorage.getItem("invite-info"))
  
  useEffect(() => {
    if (accessToken) {
      const decoded = jwt_decode(accessToken)
      dispatch(login(accessToken))
      sessionStorage.setItem("accessToken", accessToken)
      sessionStorage.setItem("nickname", decoded.nickname)
      sessionStorage.setItem("id", decoded.id)
      sessionStorage.setItem("image_path", decoded.image_path)
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      if (inviteInfo) {
        const path = `/join/${inviteInfo.travelId}/${inviteInfo.nickname}`
        sessionStorage.removeItem("invite-info")
        navigate(path, {
          replace: true
        })
      }
      else {
        navigate("/", { replace: true })
      }
    }
    // eslint-disable-next-line
  }, [accessToken])
  
  
  return (
    <>
      <span>잠시만 기다려주세요</span>
    </>
  )
}

export default KakaoRedirect