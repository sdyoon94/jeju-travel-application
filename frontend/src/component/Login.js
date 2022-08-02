import { Link } from "react-router-dom"
import "../globalStyle.css"
import "./Login.css"



function Login() {
  return(
    <div className="center">
      <h2 className="login-top">이메일로 로그인</h2>
      <form>
        <label htmlFor="email" className="block">이메일</label>
        <textarea id="email" className="input-auth" />
        <label htmlFor="password" className="block">비밀번호</label>
        <textarea className="input-auth" id="password" />
        <div>
        <input type="checkbox" id="onLogin" className="input-checkbox"/>
        <label htmlFor="onLogin">로그인 유지하기</label>
        </div>
        <button className="auth-btn">로그인</button>
      </form>
      <Link className="link" to="/"><p className="text-align">비밀번호를 잊으셨나요?</p></Link>
      <Link className="link" to="/signup"><p className="text-align">회원가입하러 가기</p></Link>

    </div>
  )
}

export default Login