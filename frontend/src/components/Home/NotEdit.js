import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "store/modules/authSlice"
import { Avatar, Box } from "@mui/material"


function NotEdit ({ editStart, setopen }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const nickname = useSelector((state) => state.auth.nickname) || sessionStorage.getItem("nickname")
  const profileImg = useSelector((state) => state.auth.profileImg) || sessionStorage.getItem("image_path")

  const handleClick = () => {
    dispatch(logout())
    if (!sessionStorage.getItem("acessToken")) {
      navigate("/login", { replace: true })
    }
  }

  return (
    <Box sx={{ width: "50vw", padding: 2, marginTop: 6 }}>
      <div className="drawer-profile">
        <p className="title-size drawer-profile-item">{nickname}님</p>
        <Avatar className="drawer-profile-item" alt="profile-img" src={profileImg} sx={{ width: 85, height: 85 }} />
        <span onClick={editStart}>회원정보 수정</span>
      </div>
      <hr />
      <button onClick={handleClick} className="logout-btn">로그아웃</button>
    </Box>
  )
}

export default NotEdit