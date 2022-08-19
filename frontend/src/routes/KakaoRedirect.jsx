import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { login } from "store/modules/authSlice"

function KakaoRedirect() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const href = window.location.href
  const params = new URL(href).searchParams
  const accessToken = params.get("accessToken")
  const refreshToken = params.get("refreshToken")

  const inviteInfo = JSON.parse(sessionStorage.getItem("invite-info"))
  
  useEffect(() => {
    if (accessToken) {
      dispatch(login({accessToken, refreshToken}))

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
  }, [accessToken])
  
  
  return (
    <div className="loading">
  </div>
  )
}

export default KakaoRedirect