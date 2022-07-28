import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchLogin } from "store/modules/auth"
import { useNavigate } from "react-router-dom"


function KakaoLoading() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const href = window.location.href
  const params = new URL(href).searchParams
  const code = params.get("code")
  const token = useSelector(state => state.auth.token)

  useEffect(() => {
    dispatch(fetchLogin(code))
  })
  
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true })
    }
    // eslint-disable-next-line
  }, [token])

  return (
    <>
      <span>잠시만 기다려주세요</span>
    </>
  )
}

export default KakaoLoading