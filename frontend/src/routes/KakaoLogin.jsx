import "./Login.css"


const URL = "http://i7a609.p.ssafy.io:8081/oauth2/authorization/kakao"

function KakaoLogin() {

  return (
    <>
      <a href={URL}>
        <img className="kakao-box" alt="kakaoLoginBtn" src="icons/kakaoLogo.png"></img>
      </a>
    </>
  )
}

export default KakaoLogin