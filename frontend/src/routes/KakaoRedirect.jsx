import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { login } from "store/modules/authSlice"

function KakaoRedirect() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const href = window.location.href
  const params = new URL(href).searchParams
  const accessToken = params.get("token")

  const inviteInfo = JSON.parse(sessionStorage.getItem("invite-info"))
  
  useEffect(() => {
    if (accessToken) {
      dispatch(login(accessToken))

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