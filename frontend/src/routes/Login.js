import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../store/modules/auth"
import { useDispatch } from "react-redux"
import "../globalStyle.css"
import "./Login.css"


function Login() {
  const dispatch = useDispatch()
  const [values, setValues] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  })
  const [loginStay, setLoginStay] = useState(true)
  const { email, password } = values
  const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  const passwordValidation = password.length > 0 && (password.length < 8 || password.length > 15)

  const handleChange = function(e) {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
    if (!emailRegex.test(email) && passwordValidation) {
      setErrors({
        email: true, 
        password: true
      })
    } else if (passwordValidation) {
      setErrors({
        email: false,
        password: true
      })
    } else if (!emailRegex.test(email)) {
      setErrors({
        email: true,
        password: false
      })
    } else {
      setErrors({
        email: false, 
        password: false
      })
    }
  }

  const handleLoginStay = function() {
    setLoginStay(!loginStay)
  }
  const handleSubmit = function(e) {
    e.preventDefault()
    if (!errors.email && !errors.password){
      dispatch(login({email, password, loginStay}))
    }
  }

  return(
    <div className="center">
      <h2 className="login-top">이메일로 로그인</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="block">이메일</label>
        <input 
          id="email" 
          type="email" 
          className="input-auth"
          name="email"
          value={email} 
          onChange={handleChange} 
          autoFocus
          required 
          />
          {errors.email && <p className="input-invalid">이메일 형식을 확인해주세요</p>}
        <label htmlFor="password" className="block">비밀번호</label>
        <input 
          id="password" 
          type="password" 
          className="input-auth" 
          name="password" 
          value={password} 
          onChange={handleChange} 
          required 
          />
          {errors.password && <p className="input-invalid">8자 이상 15자 이하로 작성해주세요</p>}
        <div>
          <input
           type="checkbox" 
           id="onLogin" 
           className="input-checkbox" 
           name="loginStay" 
           checked={loginStay} 
           onChange={handleLoginStay}
           />
          <label htmlFor="onLogin">로그인 유지하기</label>
        </div>
        <button className="auth-btn">로그인</button>
      </form>
      <Link className="link" to="/"><p>비밀번호를 잊으셨나요?</p></Link>
      <Link className="link" to="/signup"><p>회원가입하러 가기</p></Link>

    </div>
  )
}

export default Login