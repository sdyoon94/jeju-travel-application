import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


function KakaoRedirect() {
  const navigate = useNavigate()
  const href = window.location.href
  const params = new URL(href).searchParams
  const token = params.get("token")
  
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true })
      localStorage.clear()
      localStorage.setItem("token", token)
    }
    // eslint-disable-next-line
  }, [token])

  return (
    <>
      <span>잠시만 기다려주세요</span>
    </>
  )
}

export default KakaoRedirect