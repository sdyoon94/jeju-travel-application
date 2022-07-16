import { useState } from "react"
import { Link } from "react-router-dom"
import "../globalStyle.css"
import "./Login.css"



function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginStay, setLoginStay] = useState(true)

  const handleEmail = function(e) {
    setEmail(e.target.value)
  }

  const handlePassword = function(e) {
    setPassword(e.target.value)
  }

  const handleLoginStay = function() {
    setLoginStay(!loginStay)
  }

  const handleLogin = function(e) {
    e.preventDefault()
  }

  return(
    <div className="center">
      <h2 className="login-top">이메일로 로그인</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email" className="block">이메일</label>
        <input id="email" type="email" className="input-auth" value={email} onChange={handleEmail} />
        <label htmlFor="password" className="block">비밀번호</label>
        <input id="password" type="password" className="input-auth" value={password} onChange={handlePassword} />
        <div>
          <input type="checkbox" id="onLogin" className="input-checkbox" checked={loginStay} onChange={handleLoginStay}/>
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