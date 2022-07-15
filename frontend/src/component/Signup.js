import React from "react"
import { Link } from "react-router-dom"
import "../globalStyle.css"
import "./Signup.css"

function Signup() {
  return (
    <div className="center">  
      <h2 className="signup-top">이메일로 회원가입</h2>
      <form>
        <label htmlFor="email" className="block">이메일</label>
        <input id="email" name="email" type="email" className="input-auth" placeholder="example@foo.com" />
        <label htmlFor="nickname" className="block">닉네임</label>
        <input id="nickname" name="nickname" type="text" className="input-auth" />
        <label htmlFor="password" className="block">비밀번호</label>
        <input id="password" name="password" type="password" className="input-auth" />
        <label htmlFor="password-check" className="block">비밀번호 확인</label>
        <input id="password-check" name="password-check" type="password" className="input-auth" />

        <button className="auth-btn">회원가입</button>
      </form>

      <Link to="/login"><p className="text-align">로그인하러 가기</p></Link>
    </div>
  )
}

export default Signup