// 시작 시간 입력
function StartTime(){
  return(
    <div className="center">
      <h2 className="login-top">시작시간</h2>
      <form>
        <label htmlFor="email" className="block">이메일</label>
        <input id="email" type="email" className="input-auth" />
        <label htmlFor="password" className="block">비밀번호</label>
        <input id="password" type="password" className="input-auth" />
        <div>
        <input type="checkbox" id="onLogin" className="input-checkbox"/>
        <label htmlFor="onLogin">로그인 유지하기</label>
        </div>
        
      </form>
      
    </div>
  )
}