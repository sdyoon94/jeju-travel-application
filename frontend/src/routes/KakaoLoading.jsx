import { useEffect } from "react"
// import { useDispatch } from "react-redux"
// import { login } from "store/modules/auth"
import axios from "axios"

function KakaoLoading() {
  // const dispatch = useDispatch()
  const href = window.location.href
  const params = new URL(href).searchParams
  const code = params.get("code")
  console.log(code)

  // const loginKakao = async (code) => {
  //   const response = await axios.get(`http://i7a609.p.ssafy.io:8081/api/oauth/kakao/login?${code}`)
  //   console.log(response)
  // }

  useEffect(() => {
    axios({
      method:"get",
      url: `http://i7a609.p.ssafy.io:8081/api/oauth/kakao/login?code=${code}`
    })
    .then((res) => {
      console.log(res.data)
    })
    .catch((err) => {
      console.log(err.response)
    })
  })


  return (
    <>
      <span>잠시만 기다려주세요</span>
    </>
  )
}

export default KakaoLoading