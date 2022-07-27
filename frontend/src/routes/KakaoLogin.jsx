import "./Login.css"

const REDIRECT_URI = "http://localhost:3000/kakao/callback"
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`

// console.log(window.location.href)

function KakaoLogin() {

  return (
    <>
      <a href={KAKAO_AUTH_URL}>
        <img className="kakao-box" alt="kakaoLoginBtn" src="icons/kakaoLogo.png"></img>
      </a>
    </>
  )
}

export default KakaoLogin